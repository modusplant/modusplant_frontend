import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/lib/constants/auth';
import { BASE_URL } from '@/lib/constants/apiInstance';
import { decodeJWT } from '@/lib/utils/auth/decodeJWT';

/**
 * JWT 토큰이 만료되었는지 확인 (5분 여유 시간 포함)
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5분 여유 시간

  return payload.exp - now < bufferTime;
}

/**
 * Middleware: 모든 요청 전에 토큰 자동 갱신
 */
export async function proxy(request: NextRequest) {
  const rememberMe = request.cookies.get('rememberMe')?.value;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  // rememberMe가 true이고 (accessToken이 없거나 만료되었으면) 토큰 갱신 시도
  const shouldRefreshToken =
    rememberMe === 'true' && (!accessToken || isTokenExpired(accessToken));

  if (shouldRefreshToken) {
    try {
      const cookieHeader = request.headers.get('cookie') || '';

      // 백엔드에 RefreshToken으로 새 AccessToken 요청
      const response = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.data?.accessToken) {
          const nextResponse = NextResponse.next();

          // 새 AccessToken 설정
          nextResponse.cookies.set(
            ACCESS_TOKEN_COOKIE_NAME,
            data.data.accessToken,
            {
              maxAge: ACCESS_TOKEN_MAX_AGE,
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            }
          );

          // 백엔드가 Set-Cookie로 새 RefreshToken을 내려줬다면 파싱해서 설정
          const setCookieHeader = response.headers.get('set-cookie');
          if (setCookieHeader) {
            const refreshTokenMatch = /refreshToken=([^;]+)/.exec(
              setCookieHeader
            );
            if (refreshTokenMatch) {
              const newRefreshToken = refreshTokenMatch[1];

              nextResponse.cookies.set('refreshToken', newRefreshToken, {
                maxAge: REFRESH_TOKEN_MAX_AGE,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                httpOnly: true,
              });
            }
          }

          console.info(
            '[Middleware] 토큰 갱신 성공:',
            accessToken ? '만료된 토큰 갱신' : '토큰 없음으로 갱신'
          );
          return nextResponse;
        }
      } else {
        // RefreshToken도 만료된 경우 rememberMe 삭제
        console.warn('[Middleware] 토큰 갱신 실패, rememberMe 삭제');
        const nextResponse = NextResponse.next();
        nextResponse.cookies.delete('rememberMe');
        nextResponse.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
        return nextResponse;
      }
    } catch (error) {
      console.error('[Middleware] 토큰 갱신 중 오류:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    // TODO: api/v1/communication/posts 삭제
    '/((?!_next/static|_next/image|favicon.ico|api/v1/communication/posts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
