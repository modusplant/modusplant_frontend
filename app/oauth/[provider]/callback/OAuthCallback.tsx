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

export const OauthCallback = ({
  provider,
}: {
  provider: AuthProviderParam;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const queryClient = useQueryClient();
  const { reset } = useAuthStore();

  const intent: OAuthIntent = useMemo(
    () => parseState(state) ?? { action: 'LOGIN' },
    [state]
  );

  useEffect(() => {
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
            router.replace('/mypage/account');
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
  }, [code, router, provider, state, queryClient, reset, intent]);

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
