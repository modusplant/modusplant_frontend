'use client';

import PostCardGrid from '@/components/mypage/common/postCardGrid';
import EmptyLikes from '@/components/mypage/likes/emptyLikes';
import { useLikedPostsInfiniteQuery } from '@/lib/hooks/mypage/useLikedPostsInfiniteQuery';
import { useLikedPostsQuery } from '@/lib/hooks/mypage/useLikedPostsQuery';

export default function LikeSection() {
  return (
    <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 sr-only text-xl leading-[1.2] font-bold tracking-[-0.01em] md:not-sr-only">
        좋아요
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        useQueryHook={useLikedPostsQuery}
        useInfiniteQueryHook={useLikedPostsInfiniteQuery}
        emptyComponent={<EmptyLikes />}
        pageSize={9}
      />
    </div>
  );
}
