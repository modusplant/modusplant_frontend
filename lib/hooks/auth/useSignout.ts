import { useState } from 'react';

import { ApiError } from '@/lib/types/common';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api/client/auth';
import { SignoutRequestBody } from '@/lib/types/auth';

export const useSignout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const requestSignout = async (requestBody: SignoutRequestBody) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.signout(requestBody); // 회원 탈퇴 요청
      queryClient.clear(); // 쿼리 캐시 초기화
      useAuthStore.getState().reset(); // 전역 유저 상태 초기화
      document.cookie = 'accessToken=; Max-Age=0; path=/;'; // accessToken 삭제 및 만료 처리

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
    requestSignout,
  };
};
