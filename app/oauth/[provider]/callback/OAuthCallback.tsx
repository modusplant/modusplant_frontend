'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { AuthProviderParam, OAuthIntent } from '@/lib/constants/oauth';
import { parseState } from '@/lib/utils/oauth/parseState';
import { requestOAuthLogin } from '@/lib/utils/oauth/requestOAuthLogin';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { OauthApi } from '@/lib/api/client/oauth';
import Image from 'next/image';
import StateMessage from '@/components/_common/stateMessage';

export const OauthCallback = ({
  provider,
}: {
  provider: AuthProviderParam;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const isAccessDenied = error === 'access_denied'; // 사용자가 권한 동의를 거부했는지 여부

  const queryClient = useQueryClient();
  const { reset, logout } = useAuthStore();

  const intent: OAuthIntent = useMemo(
    () => parseState(state) ?? { action: 'LOGIN' },
    [state]
  );

  useEffect(() => {
    if (isAccessDenied) {
      // 사용자가 소셜 연동 권한 동의 창에서 '취소'를 누를 경우 처리
      router.replace('/login');
      return;
    }

    if (!code) return;

    const runCallback = async () => {
      switch (intent.action) {
        case 'LOGIN': {
          await requestOAuthLogin({ code, provider, router });
          break;
        }

        case 'SIGNOUT': {
          sessionStorage.setItem('signoutCode', code);
          sessionStorage.setItem('signoutProvider', provider);
          router.replace(intent.returnTo);
          break;
        }

        case 'LINK': {
          try {
            await OauthApi.mypageSocialLink(code, provider);
            router.replace('/mypage/account');
          } catch (error: any) {
            sessionStorage.setItem(
              'linkError',
              error.message || '소셜 연동에 실패했습니다.'
            );
            router.replace('/mypage/account');
          }

          break;
        }

        case 'UNLINK': {
          try {
            await OauthApi.mypageSocialUnlink(code, provider);
            sessionStorage.setItem('unlinkSuccess', 'true');
            router.replace('/login');
            logout();
          } catch (error: any) {
            sessionStorage.setItem(
              'linkError',
              error.message || '소셜 연동 해제에 실패했습니다.'
            );
            router.replace('/mypage/account');
          }

          break;
        }
      }
    };

    runCallback();
  }, [
    code,
    router,
    provider,
    intent,
    isAccessDenied,
    reset,
    queryClient,
    logout,
  ]);

  if (isAccessDenied) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <StateMessage
          imageSrc="/character_sad.svg"
          title={`${provider === 'google' ? '구글' : '카카오'} 로그인이 취소되었습니다.`}
          description="로그인 페이지로 이동합니다."
        />
      </div>
    );
  }

  if (intent.action === 'SIGNOUT' || intent.action === 'UNLINK') {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <Image src="/icon/loading.gif" alt="로딩 중" width={32} height={32} />
        <div>
          {provider === 'google' ? '구글' : '카카오'} 연동 해제를 위한 로그인
          시도 중 입니다.
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-4">
        <Image src="/icon/loading.gif" alt="로딩 중" width={32} height={32} />
        <div>
          {provider === 'google' ? '구글' : '카카오'} 로그인 처리 중입니다.
        </div>
      </div>
    );
  }
};
