'use client';

import MyCommentList from '@/components/mypage/comments/myCommentList';
import useMyCommentsQuery from '@/lib/hooks/mypage/useMyCommentsQuery';
import { useMyCommentsInfiniteQuery } from '@/lib/hooks/mypage/useMyCommentsInfiniteQuery';
import EmptyMyComments from './emptyMyComments';

export default function MyCommentSection() {
  return (
    <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 sr-only text-xl leading-[1.2] font-bold tracking-[-0.01em] md:not-sr-only">
        내 댓글
      </h1>

      {/* 댓글 목록 */}
      <MyCommentList
        useQueryHook={useMyCommentsQuery}
        useInfiniteQueryHook={useMyCommentsInfiniteQuery}
        emptyComponent={<EmptyMyComments />}
        pageSize={9}
      />
    </div>
  );
}
