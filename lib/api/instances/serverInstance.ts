import { getCookie, deleteCookie, setCookie } from '@/lib/utils/cookies/server';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
} from '@/lib/constants/auth';
import { BASE_URL } from '@/lib/constants/apiInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
import { ApiResponse, ApiError } from '@/lib/types/common';
import { createApi } from './core';

/**
 * 서버 전용: 리프레시 토큰으로 새 액세스 토큰 발급
 */
async function refreshAccessToken(): Promise<string> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.TOKEN_REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.text();
        console.error('[ServerRefreshToken] 에러 응답 본문:', errorBody);
      } catch (e) {
        console.error('[ServerRefreshToken] 응답 본문 읽기 실패');
      }

      throw new ApiError(
        response.status,
        'token_refresh_failed',
        `토큰 갱신에 실패했습니다 (${response.status})`
      );
    }

    const data: ApiResponse<{ accessToken: string }> = await response.json();

    if (!data.data || !data.data.accessToken) {
      throw new ApiError(
        500,
        'invalid_response',
        '유효하지 않은 토큰 갱신 응답입니다'
      );
    }

    const newAccessToken = data.data.accessToken;

    console.info('[ServerRefreshToken] 새 액세스 토큰 발급 성공');

    // 새 액세스 토큰 쿠키 저장 시도.
    // Server Component 렌더링 중에는 Next.js가 쿠키 쓰기를 허용하지 않아
    // 여기서 실패할 수 있는데(Server Action/Route Handler가 아님),
    // 그 경우에도 토큰 발급 자체는 성공했으므로 로그아웃시키지 않고
    // 발급받은 토큰만 반환한다. 쿠키 반영은 다음 요청 때 proxy.ts가 담당한다.
    try {
      await setCookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } catch (cookieError) {
      console.warn(
        '[ServerRefreshToken] 쿠키 저장 불가(Server Component 렌더링 중으로 추정), 이번 요청에는 토큰을 직접 사용:',
        cookieError
      );
    }

    return newAccessToken;
  } catch (error) {
    console.error('[ServerRefreshToken] 실패:', error);
    throw error;
  }
}

export const serverApiInstance = createApi({
  baseUrl: BASE_URL || '',
  includeCredentials: false,
  getAccessToken: async () => await getCookie(ACCESS_TOKEN_COOKIE_NAME),
  onUnauthorized: async () => {
    try {
      const newAccessToken = await refreshAccessToken();
      return { action: 'retry', token: newAccessToken } as const;
    } catch (e) {
      // 여기 도달하는 경우는 refreshToken 자체가 만료/무효라서
      // 백엔드가 갱신을 거부한 경우다 (쿠키 쓰기 실패는 위에서 이미 흡수됨).
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      await deleteCookie('rememberMe');
      return { action: 'fail' } as const;
    }
  },
});
