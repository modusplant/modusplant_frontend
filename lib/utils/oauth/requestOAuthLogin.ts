import { OauthApi } from '@/lib/api/client/oauth';
import { processSuccessfulAuth } from '../auth/processSuccessfulAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useSocialSignupStateStore } from '@/lib/store/socialSignupStateStore';
import { type AuthProviderParam } from '@/lib/constants/oauth';

export const requestOAuthLogin = async ({
  code,
  provider,
  router,
}: {
  code: string;
  provider: AuthProviderParam;
  router: AppRouterInstance;
}) => {
  try {
    const response =
      provider === 'google'
        ? await OauthApi.googleLogin(code)
        : await OauthApi.kakaoLogin(code);

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
      useSocialSignupStateStore
        .getState()
        .setSignupData({ email, nickname, type, provider });
      router.replace('/signup/social');
    }
  } catch (error: any) {
    sessionStorage.setItem(
      'authError',
      error.message || '카카오 로그인에 실패했습니다.'
    );
    sessionStorage.setItem('authCode', error.code);
    router.replace('/login');
  }
};
