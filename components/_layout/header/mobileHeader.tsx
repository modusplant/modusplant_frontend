'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import HeaderLogo from './headerLogo';
import HeaderGuestActions from './headerGuestActions';
import { Bell, Search, UserIcon } from 'lucide-react';
import { User } from '@/lib/types/auth';
import { useGetNotificationCountQuery } from '@/lib/hooks/notification/useGetNotificationCountQuery';

export interface HeaderProps {
  className?: string;
  initialUser: User | null;
}

export default function MobileHeader({ className, initialUser }: HeaderProps) {
  const { isAuthenticated, user: storeUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isRootPath = pathname.endsWith('/');
  const [scrolled, setScrolled] = useState(false);

  const { data: unreadNotificationsCount } = useGetNotificationCountQuery();

  // Use store user if authenticated, otherwise use initialUser
  const user = isAuthenticated ? storeUser : initialUser;

  // TODO: 검색결과 페이지 추가 시 해당 경로도 추가 필요
  // TODO: 모바일 헤더용 마이페이지 메뉴도 페이지 추가 필요(임의로 /mypage/menu로 설정. 해당 path는 현재 존재하지 않음)
  const MOBILE_HEADER_PATHS = ['/', '/mypage/menu'];
  const showMobileHeader = MOBILE_HEADER_PATHS.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname === path;
  });

  // 스크롤 감지 (70vh 기준) - TODO: 변경 예정
  useEffect(() => {
    if (!isRootPath) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight * 0.7; // 70vh

      setScrolled(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isRootPath]);

  if (!showMobileHeader) return null;

  return (
    <header
      className={cn(
        isRootPath ? 'sticky top-0' : '',
        'z-50 w-full',
        scrolled && 'bg-white',
        className
      )}
    >
      <div
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:px-4 lg:px-6',
          !isRootPath && 'border-b border-[#000000]/10'
        )}
      >
        {/* 로고 */}
        <HeaderLogo isRootPath={isRootPath} scrolled={scrolled} />
        {user ? (
          <div className="flex items-center justify-center gap-1">
            {/* 검색 - TODO: <SearchBar> 공통 컴포넌트로 변경될 수 있음 */}
            <button
              aria-label="검색"
              className="flex size-8 cursor-pointer items-center justify-center"
              onClick={() => router.push('/search')}
            >
              <Search
                className={cn(
                  'size-5 shrink-0 opacity-80',
                  scrolled || !isRootPath ? 'text-neutral-20' : 'text-white'
                )}
              />
            </button>
            {/* 알림 */}
            <button
              aria-label="알림"
              className="flex size-8 cursor-pointer items-center justify-center"
              onClick={() => router.push('/notifications')}
            >
              <Bell
                className={cn(
                  'size-5 shrink-0 opacity-80',
                  scrolled || !isRootPath ? 'text-neutral-20' : 'text-white'
                )}
              />
              {!!unreadNotificationsCount && unreadNotificationsCount > 0 && (
                <div className="absolute top-0 right-0 flex size-3.5 items-center justify-center rounded-full bg-[#f44335]">
                  <span className="typo-semibold14 text-[9px] text-white">
                    {unreadNotificationsCount > 99
                      ? `99+`
                      : unreadNotificationsCount}
                  </span>
                </div>
              )}
            </button>
            {/* 프로필 */}
            <button
              aria-label="프로필"
              className="flex size-8 cursor-pointer items-center justify-center"
              onClick={() => router.push('/mypage/menu')}
            >
              <UserIcon
                className={cn(
                  'size-5 shrink-0 opacity-80',
                  scrolled || !isRootPath ? 'text-neutral-20' : 'text-white'
                )}
              />
            </button>
          </div>
        ) : (
          <HeaderGuestActions />
        )}
      </div>
    </header>
  );
}
