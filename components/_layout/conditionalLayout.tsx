/** 전체 레이아웃 레벨 조건 관리
 * 예: Header 자체를 보여줄지
 */

'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';
import { User } from '@/lib/types/auth';
import HeaderWrapper from './header/headerWrapper';
import MobileSubHeader from './header/mobileSubHeader';

const PAGE_TITLES: Record<string, string> = {
  '/notifications': '알림',
  '/signup': '회원가입',
  '/reset-password': '비밀번호 재설정',
  '/reset-password/sent': '비밀번호 재설정',
  '/reset-email': '이메일 변경',
  '/mypage/profile': '프로필 설정',
  '/mypage/account': '계정 설정',
  '/mypage/recent': '최근에 본 글',
  '/mypage/posts': '내가 쓴 글',
  '/mypage/comments': '내 댓글',
  '/mypage/likes': '좋아요',
  '/mypage/bookmarks': '북마크',
  '/mypage/report': '건의/버그 제보',
};

// Header 또는 Footer를 표시하지 않는 페이지
const NO_HEADER_PATHS = ['/login', '/notifications'];
const NO_FOOTER_PATHS = [
  '/login',
  '/notifications',
  '/signup',
  '/reset-password',
  '/reset-email',
];

// FixedBottomButton이 있는 페이지 — Footer가 가려지지 않도록 버튼 높이만큼 하단 padding 지정
// (값은 각 페이지 FixedBottomButton 콘텐츠의 실측 높이 기준, 브라우저에서 확인 후 조정)
const FOOTER_BOTTOM_PADDING_BY_PATH: Record<string, string> = {
  '/mypage/profile': 'pb-21 md:pb-0', // Button(size md) 포함
  '/mypage/account': 'pb-12.5 md:pb-0', // 텍스트 링크만 포함, 버튼보다 낮음
  '/mypage/report': 'pb-21 md:pb-0',
};

export default function ConditionalLayout({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const pathname = usePathname();

  // Header, Footer 노출 여부 판단
  const shouldHideHeader = NO_HEADER_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const shouldHideFooter = NO_FOOTER_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const isSearchPage = pathname?.startsWith('/search');
  // 루트, 검색, (로그인), 마이페이지 메뉴에서 MobileSubHeader는 표시하지 않음
  const showMobileSubHeader =
    pathname !== '/' &&
    !isSearchPage &&
    pathname !== '/mypage/menu' &&
    pathname !== '/login';

  const pageTitle = PAGE_TITLES[pathname] ?? '';

  return (
    <div className="flex min-h-screen flex-col">
      {!shouldHideHeader && <HeaderWrapper initialUser={initialUser} />}
      {showMobileSubHeader && <MobileSubHeader title={pageTitle} />}
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && (
        <Footer className={FOOTER_BOTTOM_PADDING_BY_PATH[pathname]} />
      )}
    </div>
  );
}
