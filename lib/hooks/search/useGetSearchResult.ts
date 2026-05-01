import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/client/search';
import { GetPostsResponseData } from '@/lib/types/post';
import { SearchRequest } from '@/lib/types/search';

type SearchPageParam = Pick<
  SearchRequest,
  | 'lastPostId'
  | 'lastPostImportance'
  | 'lastPostSimilarity'
  | 'lastPostPublishedAt'
>;

/**
 * 검색 결과 조회 훅
 * @param params 검색 요청 파라미터
 * @param enabled 쿼리 활성화 여부
 */
export const useGetSearchResult = (params: SearchRequest, enabled = true) => {
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

/**
 * 검색 결과 조회 훅 (무한 스크롤)
 * @param params 검색 요청 파라미터
 * @param enabled 쿼리 활성화 여부
 */
export const useGetInfiniteSearchResult = (
  params: SearchRequest,
  enabled = true
) => {
  const {
    lastPostId,
    lastPostImportance,
    lastPostSimilarity,
    lastPostPublishedAt,
    ...queryParams
  } = params;

  return useInfiniteQuery<GetPostsResponseData>({
    queryKey: ['searchResult', queryParams],
    enabled: enabled && !!params.keyword,
    initialPageParam: {
      lastPostId,
      lastPostImportance,
      lastPostSimilarity,
      lastPostPublishedAt,
    },
    queryFn: async ({ pageParam }) => {
      const response = await searchApi.getSearchResult({
        ...queryParams,
        ...(pageParam as SearchPageParam),
      });

      if (response.status !== 200 || !response.data) {
        throw new Error(response.message || '검색 결과를 조회할 수 없습니다.');
      }

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext
        ? {
            lastPostId: lastPage.nextPostId ?? undefined,
            lastPostImportance: 3,
            lastPostSimilarity: 0.53464353,
            lastPostPublishedAt: lastPage.nextPostPublishedAt,
          }
        : undefined;
    },
  });
};
