import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/client/search';

export const useGetSearchHistory = (enabled = true) => {
  return useQuery<string[]>({
    queryKey: ['searchHistory'],
    enabled,
    queryFn: async () => {
      const response = await searchApi.getSearchHistory();

      if (response.status !== 200) {
        throw new Error(response.message || '검색 기록을 조회할 수 없습니다.');
      }

      return response.data ?? [];
    },
  });
};
