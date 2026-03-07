import PostList from '@/components/home/postList';
import HeroBanner from '@/components/home/HeroBanner';
import ScrollToTop from '@/components/home/scrollToTop';
import { serverPostApi } from '@/lib/api/server/post';
import { homeMetadata } from '@/lib/metadata/home';

export { homeMetadata as metadata };

export default async function Home() {
  // 서버에서 초기 게시글 데이터 fetch
  const initialData = await serverPostApi.getPosts({ size: 12 });

  return (
    <div className="-mt-16">
      {/* Hero Banner (히어로 이미지) */}
      <HeroBanner />

      {/* Post List Section - main 태그로 메인 콘텐츠 명시 */}
      <main className="relative mb-4 w-full py-8 md:py-12 lg:mb-9 lg:py-16">
        <div className="mx-auto flex w-full max-w-330 flex-col px-4 md:px-6 lg:px-8">
          {/* 섹션 타이틀 - header와 h1 태그 사용 */}
          <header className="flex flex-col gap-2.5">
            <p className="font-emphasis text-primary-50 text-xl font-bold">
              ModusConnect
            </p>
            <h1 className="font-emphasis text-3xl font-bold">
              우리들의 식물 이야기
            </h1>
          </header>
          <PostList initialData={initialData.data} />
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}
