'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/client/member';
import { GetRecentPostsResponseData } from '@/lib/types/post';

/**
 * 최근에 본 게시글 목록 무한 스크롤 조회 훅 (모바일)
 * @param size 페이지 크기
 * @param enabled 쿼리 활성화 여부
 */
export function useRecentPostsInfiniteQuery(
  size: number = 8,
  enabled: boolean = true
) {
  return useInfiniteQuery<GetRecentPostsResponseData>({
    queryKey: ['recentPosts', 'infinite', size],
    queryFn: async ({ pageParam }) => {
      const response = await memberApi.getRecentPosts({
        page: pageParam as number,
        size,
      });
      if (response.status !== 200 || !response.data) {
        throw new Error(
          response.message || '최근에 본 게시글을 불러오는데 실패했습니다.'
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
