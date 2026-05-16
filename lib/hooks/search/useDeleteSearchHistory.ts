import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/client/search';

export const useDeleteSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchApi.deleteSearchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
    onError: (error) => {
      console.error('검색 기록 전체 삭제 실패:', error);
    },
  });
};
