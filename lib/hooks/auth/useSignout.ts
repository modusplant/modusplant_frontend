import { useState } from 'react';

import { ApiError } from '@/lib/types/common';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/client/auth';
import { SignoutRequestBody } from '@/lib/types/auth';
import { SignoutFormValues } from '@/components/mypage/account/SignoutForm';
import { deleteAllCookies } from '@/lib/utils/cookies/client';
import { deleteCookie } from '@/lib/utils/cookies/server';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants/auth';
import { useReauthForSignout } from './useReauthForSignout';
import { useMemberAuthInfo } from '@/lib/hooks/mypage/useMemberAuthInfo';

export const useSignout = () => {
  const queryClient = useQueryClient();

  const userId = useAuthStore((state) => state.user?.id);
  const { data } = useMemberAuthInfo(userId);

  const { requestReauth } = useReauthForSignout(data?.authProvider);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSignout = async (formValues: SignoutFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const code = await requestReauth();
      const requestBody: SignoutRequestBody = {
        authCode: code,
        authProvider: data?.authProvider,
        reason: formValues.reason,
        opinion: formValues.opinion,
      };

      await authApi.signout(requestBody); // 회원 탈퇴 요청
      queryClient.clear(); // 쿼리 캐시 초기화
      useAuthStore.getState().reset(); // 전역 유저 상태 초기화
      deleteAllCookies(); // client accessToken 삭제
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME); // server accessToken 삭제

      router.replace('/');
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
