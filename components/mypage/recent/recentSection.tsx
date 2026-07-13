import RecentPostList from './recentPostList';

/**
 * 최근에 본 글 섹션 컴포넌트
 */
export default function RecentSection() {
  return (
    <div className="lg:border-surface-98 flex flex-col gap-7.5 rounded-xl bg-white lg:border lg:p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 sr-only text-xl leading-[1.2] font-bold tracking-[-0.01em] md:not-sr-only">
        최근에 본 글
      </h1>

      {/* 게시글 리스트 */}
      <RecentPostList />
    </div>
  );
}
