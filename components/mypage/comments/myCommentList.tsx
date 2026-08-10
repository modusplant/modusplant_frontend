'use client';

import { ReactNode, useMemo, useRef, useState } from 'react';
import MyCommentItem from '@/components/mypage/comments/myCommentItem';
import EmptyMyComments from '@/components/mypage/comments/emptyMyComments';
import Pagination from '@/components/mypage/common/pagination';
import { useAuthStore } from '@/lib/store/authStore';
import { InfiniteData } from '@tanstack/react-query';
import { MyComment } from '@/lib/types/comment';
import { useMediaQuery } from '@/lib/hooks/common/useMediaQuery';
import { useInfiniteScrollObserver } from '@/lib/hooks/common/useInfiniteScrollObserver';

interface MyCommentListProps<T> {
  /**
   * React Query 훅 (데스크탑 페이지네이션)
   */
  useQueryHook: (
    page: number,
    size: number,
    userId?: string,
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
    enabled: boolean,
    userId?: string
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

export default function MyCommentList<
  T extends {
    commentList: MyComment[];
    totalPages: number;
  },
>({
  useQueryHook,
  useInfiniteQueryHook,
  emptyComponent,
  pageSize = 8,
}: MyCommentListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const detectedIsMobile = useMediaQuery('(max-width: 1023px)');
  const isMobile = useInfiniteQueryHook ? detectedIsMobile : false;
  const { user } = useAuthStore();

  const {
    data,
    isLoading: isPageLoading,
    error: pageError,
  } = useQueryHook(currentPage, pageSize, user?.id, isMobile === false);

  const infiniteResult = useInfiniteQueryHook?.(
    pageSize,
    isMobile === true,
    user?.id
  );

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
    () => infiniteResult?.data?.pages.flatMap((page) => page.commentList) ?? [],
    [infiniteResult?.data]
  );

  // 디바이스 미확정 상태도 로딩으로 취급 (아직 아무 쿼리도 활성화되지 않음)
  const isLoading =
    isMobile === null ||
    (isMobile ? (infiniteResult?.isLoading ?? false) : isPageLoading);
  const error =
    isMobile === false ? pageError : (infiniteResult?.error ?? null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-body-regular-16 text-neutral-60">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-body-regular-16 text-system-alert">
          댓글 목록을 불러오는데 실패했습니다.
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
      <div className="space-y-6">
        <div className="space-y-6">
          {infinitePosts.map((comment, index) => (
            <div key={`${comment.postId}-${index}`}>
              <MyCommentItem comment={comment} />
              {/* 마지막 아이템이 아니면 구분선 추가 */}
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

  // 데스크탑
  if (data?.commentList?.length === 0) {
    return <EmptyMyComments />;
  }

  return (
    <div className="space-y-6">
      {/* 댓글 목록 */}
      <div className="space-y-6">
        {data?.commentList.map((comment, index) => (
          <div key={`${comment.postId}-${index}`}>
            <MyCommentItem comment={comment} />
            {/* 마지막 아이템이 아니면 구분선 추가 */}
            {index < data?.commentList.length - 1 && (
              <div className="mt-6 h-px w-full bg-[#EFEFEF]" />
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {data?.totalPages && data.totalPages > 1 && (
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
