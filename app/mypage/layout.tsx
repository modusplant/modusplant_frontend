import { ReactNode } from 'react';
import { mypageMetadata } from '@/lib/metadata/mypage';
import Sidebar from '@/components/mypage/sidebar/sidebar';

export { mypageMetadata as metadata };

interface MypageLayoutProps {
  children: ReactNode;
}

export default function MypageLayout({ children }: MypageLayoutProps) {
  return (
    <div className="bg-surface-98 flex min-h-screen justify-center">
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-5 py-7.5 lg:flex-row lg:gap-10">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 영역 */}
        <main className="w-full max-w-[848px] min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
