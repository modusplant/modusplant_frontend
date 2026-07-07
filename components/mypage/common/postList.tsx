'use client';

import { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import PostListItem from './postListItem';
import Pagination from './pagination';
import { PostData } from '@/lib/types/post';
import { useMediaQuery } from '@/lib/hooks/common/useMediaQuery';

interface PostListProps<T> {
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
   * @default 8
   */
  pageSize?: number;
}

/**
 * 게시글 리스트 공통 컴포넌트
 * - 로딩/에러/빈 상태 처리
 * - 게시글 리스트 렌더링
 * - 데스크탑: 페이지네이션 / 모바일(useInfiniteQueryHook 전달 시): 무한 스크롤
 */
export default function PostList<
  T extends {
    posts: PostData[];
    totalPages: number;
  },
>({
  useQueryHook,
  useInfiniteQueryHook,
  emptyComponent,
  pageSize = 8,
}: PostListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const detectedIsMobile = useMediaQuery('(max-width: 1023px)');
  const isMobile = useInfiniteQueryHook ? detectedIsMobile : false;

  const {
    data: pageData,
    isLoading: isPageLoading,
    error: pageError,
  } = useQueryHook(currentPage, pageSize, isMobile === false);

  const infiniteResult = useInfiniteQueryHook?.(pageSize, isMobile === true);

  // 무한 스크롤을 위한 관찰 대상 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infiniteResult || isMobile !== true) return;

    const { fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteResult;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [infiniteResult, isMobile]);

  const infinitePosts = useMemo(
    () => infiniteResult?.data?.pages.flatMap((page) => page.posts) ?? [],
    [infiniteResult?.data]
  );

  // 디바이스 미확정 상태도 로딩으로 취급 (아직 아무 쿼리도 활성화되지 않음)
  const isLoading =
    isMobile === null ||
    (isMobile ? (infiniteResult?.isLoading ?? false) : isPageLoading);
  const error = isMobile === false ? pageError : (infiniteResult?.error ?? null);

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
        <div className="flex flex-col gap-6">
          {infinitePosts.map((post, index) => (
            <div key={post.postId}>
              <PostListItem post={post} />
              {index < infinitePosts.length - 1 && (
                <div className="mt-6 h-px w-full bg-[#EFEFEF]" />
              )}
            </div>
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

  // 데스크탑: 페이지네이션
  if (!pageData || pageData.posts.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className="flex flex-col gap-7.5">
      {/* 게시글 리스트 */}
      <div className="flex flex-col gap-6">
        {pageData.posts.map((post, index) => (
          <div key={post.postId}>
            <PostListItem post={post} />
            {/* 마지막 아이템이 아니면 구분선 추가 */}
            {index < pageData.posts.length - 1 && (
              <div className="mt-6 h-px w-full bg-[#EFEFEF]" />
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {pageData.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pageData.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
