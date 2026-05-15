'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { AuthProviderParam } from '@/lib/constants/oauth';
import { parseState } from '@/lib/utils/oauth/parseState';
import { requestOAuthLogin } from '@/lib/utils/oauth/requestOAuthLogin';
import { SignoutRequestBody } from '@/lib/types/auth';
import { authApi } from '@/lib/api/client/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { deleteAllCookies } from '@/lib/utils/cookies/client';
import { OauthApi } from '@/lib/api/client/oauth';

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

  const intent = parseState(state) ?? { action: 'LOGIN' };

  useEffect(() => {
    if (!code) return;

    const runCallback = async () => {
      switch (intent.action) {
        case 'LOGIN': {
          await requestOAuthLogin({ code, provider, router });
          break;
        }

        case 'SIGNOUT': {
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'OAUTH_CALLBACK',
                code,
                intent,
              },
              window.location.origin
            );
            window.close();
            break;
          }
          // 모바일인 경우 팝업이 아닌 리다이렉트로 처리
          const raw = sessionStorage.getItem('signoutForm');
          const formData = raw
            ? (JSON.parse(raw) as SignoutRequestBody)
            : ({} as SignoutRequestBody);

          sessionStorage.removeItem('signoutForm');

          await authApi.signout({
            ...formData,
            authCode: code,
            authProvider: provider,
          });
          queryClient.clear(); // 쿼리 캐시 초기화
          reset(); // 전역 유저 상태 초기화
          deleteAllCookies(); // client accessToken 삭제

          router.replace('/');
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
      <div>
        {provider === 'google' ? '구글' : '카카오'} 연동 해제를 위한 로그인 시도
        중...
      </div>
    );
  } else {
    return (
      <div>{provider === 'google' ? '구글' : '카카오'} 로그인 처리 중...</div>
    );
  }
};
