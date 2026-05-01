import { OauthApi } from '@/lib/api/client/oauth';
import { SocialSignupFormValues } from '@/lib/constants/schema';
import { TERMS_VERSIONS } from '@/lib/constants/terms';
import { useAuthStore } from '@/lib/store/authStore';
import useModalStore from '@/lib/store/modalStore';
import { useOAuthStore } from '@/lib/store/oauthStore';
import { processSuccessfulAuth } from '@/lib/utils/auth/processSuccessfulAuth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const PROVIDER_LABEL = {
  kakao: '카카오',
  google: '구글',
} as const;

export function useSocialAuth() {
  const router = useRouter();
  const { signupData, clearSignupData } = useOAuthStore();
  const login = useAuthStore((state) => state.login);
  const showModal = useModalStore((state) => state.showModal);

  const handleLinkConfirm = useCallback(async () => {
    try {
      const result = await OauthApi.socialLink();
      if (result.status === 200 && result.data?.accessToken) {
        const user = await processSuccessfulAuth(result.data.accessToken, true);
        login(user);
        clearSignupData();
        router.replace('/');
      }
    } catch (error) {
      console.error('연동 실패:', error);
      showModal({
        type: 'snackbar',
        description: '연동에 실패하였습니다.',
      });
    }
  }, [login, router, clearSignupData, showModal]);

  const handleConnectCancel = useCallback(async () => {
    try {
      const result = await OauthApi.cancelSocialConnect();
      if (result.status === 200) {
        clearSignupData();
        router.replace('/login');
      }
    } catch (error) {
      console.error('취소 실패:', error);
      showModal({
        type: 'snackbar',
        description: '처리 중 오류가 발생했습니다.',
      });
    }
  }, [router, clearSignupData, showModal]);

  useEffect(() => {
    if (!signupData) return;

    if (signupData.type === 'NEED_LINK') {
      showModal({
        title: [
          '기존 가입된 계정 중',
          '동일한 이메일이 사용된 계정이 있습니다.',
        ].join('\n'),
        align: 'center',
        preserveLineBreak: true,
        description: `${PROVIDER_LABEL[signupData.provider]} 로그인 연동을 하시겠어요?`,
        type: 'two-button',
        buttonText: '연동하기',
        onCancel: handleConnectCancel,
        onConfirm: handleLinkConfirm,
      });
    }
  }, [signupData, showModal, handleConnectCancel, handleLinkConfirm]);

  /**
   * 소셜 회원가입/연동 완료 없이 페이지 이탈 시,
   * 서버의 소셜 연결(tempToken)과 클라이언트 signupData를 함께 정리하는 cleanup
   */
  useEffect(() => {
    return () => {
      if (useOAuthStore.getState().signupData) {
        OauthApi.cancelSocialConnect();
        clearSignupData();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignupSubmit = async (data: SocialSignupFormValues) => {
    if (!signupData) return;

    try {
      if (signupData.type === 'NEED_SIGNUP') {
        const result = await OauthApi.socialSignup({
          nickname: data.nickname,
          introduction: data.introduction || undefined,
          agreedTermsOfUseVersion: TERMS_VERSIONS.termsOfUse,
          agreedPrivacyPolicyVersion: TERMS_VERSIONS.privacyPolicy,
          agreedCommunityPolicyVersion: TERMS_VERSIONS.communityPolicy,
        });

        if (result.status === 200 && result.data?.accessToken) {
          const user = await processSuccessfulAuth(
            result.data.accessToken,
            true
          );
          login(user);
          clearSignupData();
          router.replace('/');
        }
      }
    } catch (error) {
      console.error('소셜 회원가입 실패', error);
      showModal({
        type: 'snackbar',
        description: '회원가입 중 오류가 발생했습니다.',
      });
    }
  };

  return {
    signupData,
    handleSignupSubmit,
  };
}
