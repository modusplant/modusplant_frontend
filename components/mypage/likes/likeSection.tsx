'use client';

import PostCardGrid from '@/components/mypage/common/postCardGrid';
import EmptyLikes from '@/components/mypage/likes/emptyLikes';
import { useLikedPostsQuery } from '@/lib/hooks/mypage/useLikedPostsQuery';
import { useState } from 'react';

export default function LikeSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const onChangePage = (pageCount: number) => {
    setCurrentPage(pageCount);
  };
  const { data, isPending, isError } = useLikedPostsQuery(currentPage, 9);
  return (
    <div className="border-surface-98 flex flex-col gap-7.5 rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        좋아요
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        data={data}
        isPending={isPending}
        isError={isError}
        emptyComponent={<EmptyLikes />}
        currentPage={currentPage}
        pageSize={9}
        onChangePage={onChangePage}
      />
    </div>
  );
}
