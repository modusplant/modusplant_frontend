'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/lib/types/auth';
import { useState, useEffect } from 'react';
import HeaderLogo from './headerLogo';
import HeaderAuthActions from './headerAuthActions';
import HeaderGuestActions from './headerGuestActions';

export interface HeaderProps {
  className?: string;
  initialUser: User | null;
}

export default function Header({ className, initialUser }: HeaderProps) {
  const { isAuthenticated, user: storeUser, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isRootPath = pathname.endsWith('/');
  const showWriteButton = !pathname.startsWith('/community/write');
  const [scrolled, setScrolled] = useState(false);

  // Use store user if authenticated, otherwise use initialUser
  const user = isAuthenticated ? storeUser : initialUser;

  // 스크롤 감지 (70vh 기준)
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

  const handleLogout = async () => {
    logout();
    router.refresh();
  };

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
          'flex h-14 w-full items-center justify-between px-2 md:px-4 lg:px-6',
          !isRootPath && 'border-b border-[#000000]/10'
        )}
      >
        {/* 로고 */}
        <HeaderLogo isRootPath={isRootPath} scrolled={scrolled} />

        {/* 로그인 상태에 따른 버튼 */}
        <div className="flex items-center gap-2 text-[13px] font-medium">
          {pathname !== '/signup' &&
            (user ? (
              <HeaderAuthActions
                user={user}
                onLogout={handleLogout}
                showWriteButton={showWriteButton}
              />
            ) : (
              <HeaderGuestActions />
            ))}
        </div>
      </div>
    </header>
  );
}
