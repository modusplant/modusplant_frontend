import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '@/lib/api/client/post';
import { GetPostsRequest, GetPostsResponseData } from '@/lib/types/post';

interface UsePostsQueryParams {
  size?: number;
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  enabled?: boolean;
  initialData?: GetPostsResponseData;
}

/**
 * 게시글 목록 조회 (무한 스크롤)
 * @param params 조회 파라미터
 */
export function usePostsQuery({
  size = 12,
  primaryCategoryId,
  secondaryCategoryId,
  enabled = true,
  initialData,
}: UsePostsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', { primaryCategoryId, secondaryCategoryId }],
    queryFn: async ({ pageParam }) => {
      const params: GetPostsRequest = {
        size,
        lastPostId: pageParam,
        primaryCategoryId,
        secondaryCategoryId,
      };

      const response = await postApi.getPosts(params);

      if (!(response.status === 200)) {
        throw new Error(response.message || '게시글 조회에 실패했습니다');
      }

      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextPostId : undefined;
    },
    // 서버에서 가져온 초기 데이터 설정
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    enabled,
  });
}
