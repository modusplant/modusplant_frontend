/** 전체 레이아웃 레벨 조건 관리
 * 예: Header 자체를 보여줄지
 */

'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';
import { User } from '@/lib/types/auth';
import HeaderWrapper from './header/headerWrapper';

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

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper initialUser={initialUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
