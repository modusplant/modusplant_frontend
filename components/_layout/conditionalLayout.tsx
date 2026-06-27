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
  '/mypage/profile': '프로필 설정',
  '/mypage/account': '계정 설정',
  // '/mypage/account/change-email': '이메일 변경', // 추후 모바일용 이메일 변경 페이지 추가 시 활성화
  // '/mypage/account/change-password': '비밀번호 변경',  // 추후 모바일용 비밀번호 변경 페이지 추가 시 활성화
  '/mypage/recent': '최근에 본 글',
  '/mypage/posts': '내가 쓴 글',
  '/mypage/comments': '내 댓글',
  '/mypage/likes': '좋아요',
  '/mypage/bookmarks': '북마크',
  '/mypage/report': '건의/버그 제보',
};

export default function ConditionalLayout({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const pathname = usePathname();

  // auth 관련 페이지에서는 Header와 Footer를 표시하지 않음
  const isAuthPage = pathname?.startsWith('/login');
  // 알림 페이지에서도 Header와 Footer 표시하지 않음
  const isNotificationPage = pathname?.startsWith('/notifications');
  if (isAuthPage || isNotificationPage) {
    return <>{children}</>;
  }

  const isSearchPage = pathname?.startsWith('/search');
  // 루트, 검색, (로그인), 마이페이지 메뉴에서 MobileSubHeader는 표시하지 않음
  const showMobileSubHeader =
    pathname !== '/' && !isSearchPage && pathname !== '/mypage/menu';

  const pageTitle = PAGE_TITLES[pathname] ?? '';

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper initialUser={initialUser} />
      {showMobileSubHeader && <MobileSubHeader title={pageTitle} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
