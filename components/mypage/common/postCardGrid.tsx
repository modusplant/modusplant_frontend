'use client';

import { ReactNode, useMemo, useRef, useState } from 'react';
import PostCard from '@/components/_common/postCard';
import Pagination from './pagination';
import { PostData } from '@/lib/types/post';
import { useMediaQuery } from '@/lib/hooks/common/useMediaQuery';
import { useInfiniteScrollObserver } from '@/lib/hooks/common/useInfiniteScrollObserver';
import { InfiniteData } from '@tanstack/react-query';

interface PostCardGridProps<T> {
  /**
   * React Query 훅 (데스크탑 페이지네이션)
   */
  useQueryHook: (
    page: number,
    size: number,
    enabled?: boolean
  ) => {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  /**
   * React Query 훅 (모바일 무한 스크롤) — 전달 시에만 모바일 분기 활성화
   */
  useInfiniteQueryHook?: (
    size: number,
    enabled: boolean
  ) => {
    data: InfiniteData<T> | undefined;
    isLoading: boolean;
    error: Error | null;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };

  /**
   * 빈 상태 컴포넌트
   */
  emptyComponent: ReactNode;
  /**
   * 페이지당 아이템 개수
   * @default 9
   */
  pageSize?: number;
}

/**
 * 게시글 카드 그리드 공통 컴포넌트
 * - 로딩/에러/빈 상태 처리
 * - 카드 그리드 렌더링 (3열)
 * - 페이지네이션
 */
export default function PostCardGrid<
  T extends {
    posts: PostData[];
    totalPages: number;
  },
>({
  useQueryHook,
  useInfiniteQueryHook,
  emptyComponent,
  pageSize = 9,
}: PostCardGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const detectedIsMobile = useMediaQuery('(max-width: 1023px)');
  const isMobile = useInfiniteQueryHook ? detectedIsMobile : false;

  const {
    data,
    isLoading: isPageLoading,
    error: pageError,
  } = useQueryHook(currentPage, pageSize, isMobile === false);

  const infiniteResult = useInfiniteQueryHook?.(pageSize, isMobile === true);

  // 무한 스크롤을 위한 관찰 대상 ref
  const observerTarget = useRef<HTMLDivElement>(null);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    infiniteResult ?? {};

  useInfiniteScrollObserver(observerTarget, {
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage: isFetchingNextPage ?? false,
    fetchNextPage: fetchNextPage ?? (() => {}),
    enabled: isMobile === true,
  });

  const infinitePosts = useMemo(
    () => infiniteResult?.data?.pages.flatMap((page) => page.posts) ?? [],
    [infiniteResult?.data]
  );

  // 디바이스 미확정 상태도 로딩으로 취급 (아직 아무 쿼리도 활성화되지 않음)
  const isLoading =
    isMobile === null ||
    (isMobile ? (infiniteResult?.isLoading ?? false) : isPageLoading);
  const error =
    isMobile === false ? pageError : (infiniteResult?.error ?? null);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-neutral-40 text-base">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-system-alert text-base">
          게시글 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  // 모바일: 무한 스크롤
  if (isMobile) {
    if (infinitePosts.length === 0) {
      return <>{emptyComponent}</>;
    }

    return (
      <div className="flex flex-col gap-7.5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-10.5 md:grid-cols-2 md:gap-y-15">
          {infinitePosts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={observerTarget} className="h-px" />

        {infiniteResult?.isFetchingNextPage && (
          <div className="flex items-center justify-center py-6">
            <div className="text-neutral-40 text-base">로딩 중...</div>
          </div>
        )}
      </div>
    );
  }

  // 데스크탑
  if (!data || data.posts.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className="flex flex-col gap-15">
      {/* 카드 그리드 (3열) */}
      <div className="grid grid-cols-3 gap-x-5 gap-y-10.5">
        {data.posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {data.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
