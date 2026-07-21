'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import { usePathname, useRouter } from 'next/navigation';
import HeaderLogo from './headerLogo';
import HeaderGuestActions from './headerGuestActions';
import { Bell, Search, UserIcon } from 'lucide-react';
import { useGetNotificationCountQuery } from '@/lib/hooks/notification/useGetNotificationCountQuery';
import { HeaderSharedProps } from '@/lib/types/header';

export default function MobileHeader({
  isRootPath,
  scrolled,
  user,
  className,
}: HeaderSharedProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: unreadNotificationsCount } = useGetNotificationCountQuery();

  const MOBILE_HEADER_PATHS = ['/', '/mypage/menu', '/search'];
  const showMobileHeader = MOBILE_HEADER_PATHS.includes(pathname);

  if (!showMobileHeader) return null;

  return (
    <div
      className={cn(
        'flex h-14 w-full items-center justify-between px-4 lg:px-6',
        !isRootPath && 'border-b border-[#000000]/10',
        className
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
            className="relative flex size-8 cursor-pointer items-center justify-center"
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
  );
}
