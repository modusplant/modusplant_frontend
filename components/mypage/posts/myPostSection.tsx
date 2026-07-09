'use client';

import MyPostList from '@/components/mypage/posts/myPostList';

export default function MyPostSection() {
  return (
    <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 sr-only text-xl leading-[1.2] font-bold tracking-[-0.01em] md:not-sr-only">
        내가 쓴 글
      </h1>

      {/* 게시글 목록 */}
      <MyPostList />
    </div>
  );
}
