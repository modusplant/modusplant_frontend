'use client';

import PostCardGrid from '@/components/mypage/common/postCardGrid';
import EmptyBookmarks from '@/components/mypage/bookmarks/emptyBookmarks';
import { useBookmarkedPostsQuery } from '@/lib/hooks/mypage/useBookmarkedPostsQuery';
import { useState } from 'react';

export default function BookmarkSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const onChangePage = (pageCount: number) => {
    setCurrentPage(pageCount);
  };
  const { data, isPending, isError } = useBookmarkedPostsQuery(currentPage, 9);

  return (
    <div className="border-surface-98 flex flex-col gap-7.5 rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        북마크
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        data={data}
        isPending={isPending}
        isError={isError}
        emptyComponent={<EmptyBookmarks />}
        currentPage={currentPage}
        pageSize={9}
        onChangePage={onChangePage}
      />
    </div>
  );
}
