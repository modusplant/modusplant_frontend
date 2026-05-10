import { authApi } from '@/lib/api/client/auth';
import type { SignoutRequestBody } from '@/lib/types/auth';
import { deleteAllCookies } from '../cookies/client';
import { AuthProviderParam } from '@/lib/constants/oauth';
import { QueryClient } from '@tanstack/react-query';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const requestSignout = async ({
  code,
  provider,
  queryClient,
  reset,
  router,
}: {
  code: string;
  provider: AuthProviderParam;
  queryClient: QueryClient;
  reset: () => void;
  router: AppRouterInstance;
}) => {
  const rawFormData = sessionStorage.getItem('signoutForm');
  const formData = rawFormData
    ? (JSON.parse(rawFormData) as SignoutRequestBody)
    : ({} as SignoutRequestBody);
  try {
    await authApi.signout({
      ...formData,
      authCode: code,
      authProvider: provider,
    });
    queryClient.clear(); // 쿼리 캐시 초기화
    reset(); // 전역 유저 상태 초기화
    deleteAllCookies(); // client accessToken 삭제
    sessionStorage.removeItem('signoutForm');
    router.replace('/');
  } catch {}
};
