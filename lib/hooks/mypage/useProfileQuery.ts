import { useQuery } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/client/member';
import { ProfileData } from '@/lib/types/member';
import { ApiResponse } from '@/lib/types/common';

/**
 * 프로필 조회 React Query 훅
 * @returns useQuery 결과 객체
 */
export function useProfileQuery() {
  return useQuery<ApiResponse<ProfileData>, Error>({
    queryKey: ['profile'],
    queryFn: () => memberApi.getProfile(),
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 1,
  });
}
