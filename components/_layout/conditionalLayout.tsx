'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';
import { User } from '@/lib/types/auth';
import DesktopHeader from './header/desktopHeader';

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
      <DesktopHeader initialUser={initialUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
