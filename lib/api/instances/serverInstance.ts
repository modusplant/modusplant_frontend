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

    // 새 액세스 토큰 쿠키에 저장
    await setCookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

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
      await refreshAccessToken();
      return 'retry' as const;
    } catch (e) {
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      await deleteCookie('rememberMe');
      return 'fail' as const;
    }
  },
});
