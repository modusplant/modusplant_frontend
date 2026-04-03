'use client';

import { OauthApi } from '@/lib/api/client/oauth';
import { useAuthStore } from '@/lib/store/authStore';
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

        if (response.status === 200 && response.data?.accessToken) {
          const user = await processSuccessfulAuth(
            response.data.accessToken,
            true
          );

          login(user);
          router.push('/');
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
