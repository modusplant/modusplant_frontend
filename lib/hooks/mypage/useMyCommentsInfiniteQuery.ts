'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { commentApi } from '@/lib/api/client/comment';
import { GetMyCommentsResponseData } from '@/lib/types/comment';

/**
 * 내 댓글 목록 조회 무한 스크롤 조회 훅 (모바일)
 * @param size 페이지 크기
 * @param enabled 쿼리 활성화 여부
 */
export function useMyCommentsInfiniteQuery(
  size: number = 8,
  enabled: boolean = true,
  userId?: string
) {
  return useInfiniteQuery<GetMyCommentsResponseData>({
    queryKey: ['myComments', 'infinite', size, userId],
    queryFn: async ({ pageParam }) => {
      const response = await commentApi.getMyComments({
        page: pageParam as number,
        size,
        uuid: userId,
      });
      if (response.status !== 200 || !response.data) {
        throw new Error(
          response.message || '내가 작성한 댓글을 불러오는데 실패했습니다.'
        );
      }
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    enabled,
    gcTime: 1000 * 60 * 5, // 5분
  });
}
