'use client';

import PostCardGrid from '@/components/mypage/common/postCardGrid';
import EmptyBookmarks from '@/components/mypage/bookmarks/emptyBookmarks';
import { useBookmarkedPostsQuery } from '@/lib/hooks/mypage/useBookmarkedPostsQuery';
import { useBookmarkedPostsInfiniteQuery } from '@/lib/hooks/mypage/useBookmarkedPostsInfiniteQuery';

export default function BookmarkSection() {
  return (
    <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 sr-only text-xl leading-[1.2] font-bold tracking-[-0.01em] md:not-sr-only">
        북마크
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        useQueryHook={useBookmarkedPostsQuery}
        useInfiniteQueryHook={useBookmarkedPostsInfiniteQuery}
        emptyComponent={<EmptyBookmarks />}
        pageSize={9}
      />
    </div>
  );
}
