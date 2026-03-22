import { ApiResponse, ApiError } from '@/lib/types/common';
import { getCookie, setCookie, deleteCookie } from '@/lib/utils/cookies/client';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
} from '@/lib/constants/auth';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';

const BASE_URL = ''; // 클라이언트는 상대 경로 사용 (rewrites 적용)

/**
 * 클라이언트 전용: 리프레시 토큰으로 새 액세스 토큰 발급
 */
async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}${AUTH_ENDPOINTS.TOKEN_REFRESH}`, {
      method: 'POST',
      credentials: 'include', // 쿠키 자동 전송
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.text();
        console.error('[RefreshToken] 에러 응답 본문:', errorBody);
      } catch (e) {
        console.error('[RefreshToken] 응답 본문 읽기 실패');
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

    console.info('[RefreshToken] 새 액세스 토큰 발급 성공');

    // 새 액세스 토큰 쿠키에 저장
    setCookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/',
      secure: true,
      sameSite: 'Lax',
    });

    return newAccessToken;
  } catch (error) {
    console.error('[RefreshToken] 실패:', error);
    throw error;
  }
}

import { createApi } from './core';

export const clientApiInstance = createApi({
  baseUrl: BASE_URL,
  includeCredentials: true,
  getAccessToken: () => getCookie(ACCESS_TOKEN_COOKIE_NAME),
  onUnauthorized: async () => {
    try {
      await refreshAccessToken();
      return 'retry' as const;
    } catch (e) {
      deleteCookie(ACCESS_TOKEN_COOKIE_NAME, { path: '/' });
      deleteCookie('rememberMe', { path: '/' });
      return 'fail' as const;
    }
  },
});
