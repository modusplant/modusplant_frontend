import { ApiResponse, ApiError } from '../../types/common';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  isRetry?: boolean;
  enableCache?: boolean;
  overrideToken?: string;
}

export interface ApiRequestOptions {
  skipAuth?: boolean;
  enableCache?: boolean;
  headers?: Record<string, string>;
}

export type UnauthorizedResult =
  | { action: 'retry'; token?: string }
  | { action: 'fail' };

interface CreateApiOptions {
  baseUrl: string;
  includeCredentials?: boolean;
  getAccessToken?: () => string | null | Promise<string | null>;
  /**
   * 401 처리 훅. "retry"를 반환하면 한 번 재시도합니다.
   * token을 함께 반환하면 재시도 요청에 해당 토큰을 직접 사용합니다
   * (쿠키를 다시 읽지 않음 — 쿠키 쓰기가 불가능한 컨텍스트에서 갱신된 경우 대응).
   */
  onUnauthorized?: () => Promise<UnauthorizedResult> | UnauthorizedResult;
}

async function requestCore<T = any>(
  endpoint: string,
  config: RequestConfig,
  opts: CreateApiOptions
): Promise<ApiResponse<T>> {
  const {
    skipAuth = false,
    isRetry = false,
    enableCache = false,
    overrideToken,
    ...fetchConfig
  } = config || {};

  const url = `${opts.baseUrl}${endpoint}`;

  const isFormData = fetchConfig.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(!enableCache && {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    }),
    ...(fetchConfig.headers as Record<string, string>),
  };

  if (!skipAuth && opts.getAccessToken) {
    const token = overrideToken ?? (await opts.getAccessToken());
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      ...(opts.includeCredentials ? { credentials: 'include' as const } : {}),
    });

    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        'invalid_response',
        `서버 응답을 처리할 수 없습니다 (${response.status})`
      );
    }

    // 디버깅용 로그 (확인 후 제거)
    if (!response.ok) {
      console.error('[API Error] status:', response.status);
      console.error('[API Error body:', data);
    }

    if (data.status === 401 && !skipAuth) {
      if (!isRetry && opts.onUnauthorized) {
        const result = await opts.onUnauthorized();
        if (result.action === 'retry') {
          return requestCore<T>(
            endpoint,
            { ...config, isRetry: true, overrideToken: result.token },
            opts
          );
        }
      }
      throw new ApiError(401, 'authentication_required', '다시 로그인해주세요');
    }

    if (data.status >= 400) {
      throw new ApiError(
        data.status,
        data.code,
        data.message || '요청에 실패했습니다'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'network_error', '네트워크 오류가 발생했습니다');
  }
}

export function createApi(options: CreateApiOptions) {
  return {
    get: <T = any>(endpoint: string, opts: ApiRequestOptions = {}) =>
      requestCore<T>(endpoint, { ...opts, method: 'GET' }, options),

    post: <T = any>(
      endpoint: string,
      body?: any,
      opts: ApiRequestOptions = {}
    ) =>
      requestCore<T>(
        endpoint,
        {
          ...opts,
          method: 'POST',
          body:
            body instanceof FormData
              ? body
              : body !== undefined
                ? JSON.stringify(body)
                : undefined,
        },
        options
      ),

    put: <T = any>(
      endpoint: string,
      body?: any,
      opts: ApiRequestOptions = {}
    ) =>
      requestCore<T>(
        endpoint,
        {
          ...opts,
          method: 'PUT',
          body:
            body instanceof FormData
              ? body
              : body !== undefined
                ? JSON.stringify(body)
                : undefined,
        },
        options
      ),

    patch: <T = any>(
      endpoint: string,
      body?: any,
      opts: ApiRequestOptions = {}
    ) =>
      requestCore<T>(
        endpoint,
        {
          ...opts,
          method: 'PATCH',
          body:
            body instanceof FormData
              ? body
              : body !== undefined
                ? JSON.stringify(body)
                : undefined,
        },
        options
      ),

    delete: <T = any>(endpoint: string, opts: ApiRequestOptions = {}) =>
      requestCore<T>(endpoint, { ...opts, method: 'DELETE' }, options),
  };
}
