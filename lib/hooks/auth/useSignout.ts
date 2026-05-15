import { useState } from 'react';

import { ApiError } from '@/lib/types/common';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/client/auth';
import { SignoutRequestBody } from '@/lib/types/auth';
import { SignoutFormValues } from '@/components/mypage/account/SignoutForm';
import { deleteAllCookies } from '@/lib/utils/cookies/client';

import { useMemberAuthInfo } from '@/lib/hooks/mypage/useMemberAuthInfo';
import { showModal } from '@/lib/store/modalStore';
import { parseAuthProvider } from '@/lib/utils/oauth/parseAuthProvider';
import { buildAuthUrl } from '@/lib/utils/oauth/buildAuthUrl';
import { clientApiInstance } from '@/lib/api/instances/clientInstance';

export const useSignout = () => {
  const queryClient = useQueryClient();

  const { user, reset } = useAuthStore();

  const { data } = useMemberAuthInfo(user?.id);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSignout = async (formValues: SignoutFormValues) => {
    sessionStorage.setItem('signoutForm', JSON.stringify({ ...formValues }));

    const authProvider = data
      ? parseAuthProvider(data.authProvider)
      : undefined;

    if (authProvider) {
      const url = buildAuthUrl({
        provider: authProvider,
        intent: {
          action: 'SIGNOUT',
          returnTo: '/mypage/account?signout=pending',
        },
      });
      window.location.href = url;
      return;
    }
    await executeSignout({ formValues });
  };

  const executeSignout = async ({
    formValues,
    authCode,
    authProvider,
  }: {
    formValues: SignoutFormValues;
    authCode?: string;
    authProvider?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody: SignoutRequestBody = {
        authCode,
        authProvider,
        reason: formValues.reason,
        opinion: formValues.opinion,
      };

      await authApi.signout(requestBody); // 회원 탈퇴 요청
      queryClient.clear(); // 쿼리 캐시 초기화
      reset(); // zustand 유저 상태 초기화
      deleteAllCookies(); // client cookie 삭제
      await clientApiInstance.post('/api/auth/clear-cookies'); // server cookie 삭제
      sessionStorage.removeItem('signoutForm'); // sessionStorage 정리

      window.location.href = '/';
      showModal({ description: '회원 탈퇴되었습니다.', type: 'snackbar' });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        setError(
          new ApiError(500, 'UNKNOWN', '알 수 없는 오류가 발생했습니다.')
        );
      }
    } finally {
      sessionStorage.removeItem('signoutCode');
      sessionStorage.removeItem('signoutProvider');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSignout,
    executeSignout,
  };
};
