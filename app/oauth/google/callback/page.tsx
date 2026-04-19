'use client';

import { OauthApi } from '@/lib/api/client/oauth';
import { useAuthStore } from '@/lib/store/authStore';
import { useOAuthStore } from '@/lib/store/oauthStore';
import { processSuccessfulAuth } from '@/lib/utils/auth/processSuccessfulAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function GoogleCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) return;

    const handleGoogleLogin = async () => {
      try {
        const response = await OauthApi.googleLogin(code);
        if (!response.data) return;

        const { type } = response.data;

        if (type === 'LOGIN') {
          // 기존 유저 로그인 처리
          const { accessToken } = response.data;
          const user = await processSuccessfulAuth(
            accessToken,
            true // TODO: 소셜 로그인 rememberMe, refreshToken 정책 확인
          );
          useAuthStore.getState().login(user);
          router.replace('/');
        } else if (type === 'NEED_SIGNUP' || type === 'NEED_LINK') {
          // 신규 유저, 기존 이메일 계정 연동 처리
          const { email, nickname } = response.data;
          useOAuthStore
            .getState()
            .setSignupData({ email, nickname, type, provider: 'google' });
          router.replace('/signup/social');
        }
      } catch (error) {
        console.error('구글 로그인 실패', error);
        router.replace('/login');
      }
    };
    handleGoogleLogin();
  }, [code, router]);

  return <div>구글 로그인 처리 중...</div>;
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<div>구글 로그인 처리 중...</div>}>
      <GoogleCallbackInner />
    </Suspense>
  );
}
