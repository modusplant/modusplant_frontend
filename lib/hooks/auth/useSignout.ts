import { useState } from 'react';

import { ApiError } from '@/lib/types/common';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/client/auth';
import { SignoutRequestBody } from '@/lib/types/auth';
import { SignoutFormValues } from '@/components/mypage/account/SignoutForm';
import { deleteAllCookies } from '@/lib/utils/cookies/client';

import { useMemberAuthInfo } from '@/lib/hooks/mypage/useMemberAuthInfo';
import { showModal } from '@/lib/store/modalStore';
import { openOAuthPopup } from '@/lib/utils/oauth/openOAuthPopup';
import { AuthProviderParam } from '@/lib/constants/oauth';
import { parseAuthProvider } from '@/lib/utils/oauth/parseAuthProvider';

export const useSignout = () => {
  const queryClient = useQueryClient();

  const { user, reset } = useAuthStore();

  const { data } = useMemberAuthInfo(user?.id);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSignout = async (formValues: SignoutFormValues) => {
    setIsLoading(true);
    setError(null);
    let authCode: string | undefined;
    let authProvider: AuthProviderParam | undefined;

    sessionStorage.setItem('signoutForm', JSON.stringify({ ...formValues }));

    if (data) {
      const { authProvider: provider } = data;
      authProvider = parseAuthProvider(provider) ?? undefined;
    }

    if (authProvider) {
      const { code } = await openOAuthPopup({
        provider: authProvider,
        intent: { action: 'SIGNOUT' },
      });
      authCode = code;
    }

    try {
      const requestBody: SignoutRequestBody = {
        authCode,
        authProvider,
        reason: formValues.reason,
        opinion: formValues.opinion,
      };

      await authApi.signout(requestBody); // 회원 탈퇴 요청
      queryClient.clear(); // 쿼리 캐시 초기화
      reset(); // 전역 유저 상태 초기화
      deleteAllCookies(); // client accessToken 삭제

      router.replace('/');
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
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSignout,
  };
};
