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

export const useSignout = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSignout = async (formValues: SignoutFormValues) => {
    console.log(formValues);
    // TODO: 소셜 연동 해제를 위한 재로그인 로직 필요

    const requestBody: SignoutRequestBody = {
      authCode: '',
      authProvider: '',
      reason: formValues.reason,
      opinion: formValues.opinion,
    };
    setIsLoading(true);
    setError(null);
    try {
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
