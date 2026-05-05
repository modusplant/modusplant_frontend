import { OauthApi } from '@/lib/api/client/oauth';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
import { SocialSignupFormValues } from '@/lib/constants/schema';
import { TERMS_VERSIONS } from '@/lib/constants/terms';
import { useAuthStore } from '@/lib/store/authStore';
import useModalStore from '@/lib/store/modalStore';
import { useOAuthStore } from '@/lib/store/oauthStore';
import { processSuccessfulAuth } from '@/lib/utils/auth/processSuccessfulAuth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

const PROVIDER_LABEL = {
  kakao: '카카오',
  google: '구글',
} as const;

export function useSocialAuth() {
  const router = useRouter();
  const { signupData, clearSignupData } = useOAuthStore();
  const login = useAuthStore((state) => state.login);
  const showModal = useModalStore((state) => state.showModal);

  const isSocialAuthCompleted = useRef(false); // 소셜 인증 완료 여부 플래그

  /**
   * 사용자가 소셜 회원가입/연동(혹은 연동 취소)을 완료하지 않고
   * 이탈 할 경우 소셜 플랫폼과 서비스의 연결을 해제하는 로직
   *
   * ex) 브라우저 뒤로가기, 새로고침, 탭/창 닫기 등
   */

  useEffect(() => {
    isSocialAuthCompleted.current = false; // handleConnectCancel 이후 소셜 로그인 재시도 대비 초기화

    // 브라우저 이벤트 발생 시 실행되는 함수
    const cancelConnect = () => {
      if (isSocialAuthCompleted.current || !useOAuthStore.getState().signupData)
        return;

      fetch(AUTH_ENDPOINTS.CANCEL_SOCIAL_CONNECT, {
        method: 'DELETE',
        keepalive: true, // 언로드 중에도 요청 보장
      });
      useOAuthStore.getState().clearSignupData();
    };

    // 탭 닫기, 새로고침, 주소창 직접 입력
    const handleBeforeUnload = () => cancelConnect();

    // 브라우저 뒤로가기/앞으로가기
    const handlePopState = () => cancelConnect();

    history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLinkConfirm = useCallback(async () => {
    try {
      const result = await OauthApi.socialLink();
      if (result.status === 200 && result.data?.accessToken) {
        const user = await processSuccessfulAuth(result.data.accessToken, true);
        login(user);
        isSocialAuthCompleted.current = true;
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
        isSocialAuthCompleted.current = true;
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
        shouldUseLineBreak: true,
        description: `${PROVIDER_LABEL[signupData.provider]} 로그인 연동을 하시겠어요?`,
        type: 'two-button',
        buttonText: '연동하기',
        onCancel: handleConnectCancel,
        onConfirm: handleLinkConfirm,
      });
    }
  }, [signupData, showModal, handleConnectCancel, handleLinkConfirm]);

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
          isSocialAuthCompleted.current = true;
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
