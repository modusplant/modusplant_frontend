'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import HeaderLogo from './headerLogo';
import HeaderAuthActions from './headerAuthActions';
import HeaderGuestActions from './headerGuestActions';
import SearchButton from '@/components/search/searchButton';
import { HeaderSharedProps } from '@/lib/types/header';

export default function DesktopHeader({
  user,
  scrolled,
  isRootPath,
  className,
}: HeaderSharedProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    router.refresh();
  };

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
      {/* 로그인 상태에 따른 버튼 */}
      <div className="flex items-center gap-2.5 text-[13px] font-medium">
        {pathname !== '/signup' && pathname !== '/search' && <SearchButton />}
        {pathname !== '/signup' &&
          (user ? (
            <HeaderAuthActions
              user={user}
              onLogout={handleLogout}
              scrolled={scrolled}
              isRootPath={isRootPath}
            />
          ) : (
            <HeaderGuestActions />
          ))}
      </div>
    </div>
  );
}
