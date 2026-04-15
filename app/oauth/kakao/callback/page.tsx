'use client';

import { OauthApi } from '@/lib/api/client/oauth';
import { useAuthStore } from '@/lib/store/authStore';
import { useOAuthStore } from '@/lib/store/oauthStore';
import { processSuccessfulAuth } from '@/lib/utils/auth/processSuccessfulAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function KakaoCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const { login } = useAuthStore();

  useEffect(() => {
    if (!code) return;

    const handleKakaoLogin = async () => {
      try {
        const response = await OauthApi.kakaoLogin(code);
        if (!response.data) return;

        const { type } = response.data;

        if (type === 'LOGIN') {
          // 기존 유저 로그인 처리
          const { accessToken } = response.data;
          const user = await processSuccessfulAuth(
            accessToken,
            true // TODO: 소셜 로그인 rememberMe, refreshToken 정책 확인
          );
          login(user);
          router.push('/');
        } else if (type === 'NEED_SIGNUP') {
          // 신규 유저 처리
          const { email, nickname } = response.data;
          useOAuthStore.getState().setSignupData({ email, nickname, type });
          router.replace('/signup/social');
        } else if (type === 'NEED_LINK') {
          // 기존 이메일 계정 연동
          const { email, nickname } = response.data;
          useOAuthStore.getState().setSignupData({ email, nickname, type });
          router.replace(`/signup/social`);
        }
      } catch (error) {
        console.error('카카오 로그인 실패', error);
        router.push('/login');
      }
    };
    handleKakaoLogin();
  }, [code, router]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default function KakaoCallback() {
  return (
    <Suspense fallback={<div>카카오 로그인 처리 중...</div>}>
      <KakaoCallbackInner />
    </Suspense>
  );
}
