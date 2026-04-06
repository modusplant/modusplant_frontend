'use client';

import { ReactNode } from 'react';
import PostCard from '@/components/_common/postCard';
import Pagination from './pagination';
import { GetMyPostsResponseData } from '@/lib/types/post';

interface PostCardGridProps {
  data?: GetMyPostsResponseData;
  isPending: boolean;
  isError: boolean;
  /**
   * 빈 상태 컴포넌트
   */
  emptyComponent: ReactNode;
  currentPage: number;
  /**
   * 페이지당 아이템 개수
   * @default 9
   */
  pageSize?: number;
  onChangePage: (pageCount: number) => void;
}

/**
 * 게시글 카드 그리드 공통 컴포넌트
 * - 로딩/에러/빈 상태 처리
 * - 카드 그리드 렌더링 (3열)
 * - 페이지네이션
 */
export default function PostCardGrid({
  data,
  isPending,
  isError,
  emptyComponent,
  currentPage,
  onChangePage,
}: PostCardGridProps) {
  // 로딩 상태
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-neutral-40 text-base">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-system-alert text-base">
          게시글 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data || data.posts.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className="flex flex-col gap-15">
      {/* 카드 그리드 (3열) */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-15 md:grid-cols-2 lg:grid-cols-3">
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
            onPageChange={onChangePage}
          />
        </div>
      )}
    </div>
  );
}
