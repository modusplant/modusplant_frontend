import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/client/search';
import { GetPostsResponseData } from '@/lib/types/post';
import { SearchRequest } from '@/lib/types/search';

/**
 * 검색 결과 조회 훅
 * @param params 검색 요청 파라미터
 * @param enabled 쿼리 활성화 여부
 */
export const useGetSearchResult = (
  params: SearchRequest,
  enabled = true
) => {
  return useQuery<GetPostsResponseData>({
    queryKey: ['searchResult', params],
    enabled: enabled && !!params.keyword,
    queryFn: async () => {
      const response = await searchApi.getSearchResult(params);

      if (response.status !== 200 || !response.data) {
        throw new Error(response.message || '검색 결과를 조회할 수 없습니다.');
      }

      return response.data;
    },
  });
};
