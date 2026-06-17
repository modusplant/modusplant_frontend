'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/lib/types/auth';
import { cn } from '@/lib/utils/tailwindHelper';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MobileHeader from './mobileHeader';
import DesktopHeader from './desktopHeader';

export interface HeaderProps {
  className?: string;
  initialUser: User | null;
}

export default function HeaderWrapper({ className, initialUser }: HeaderProps) {
  const pathname = usePathname();
  const isRootPath = pathname.endsWith('/');
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, user: storeUser } = useAuthStore();
  const user = isAuthenticated ? storeUser : initialUser;

  // 스크롤 감지 (루트페이지 히어로 배너 기준)
  useEffect(() => {
    if (!isRootPath) return;

    const banner = document.querySelector('#hero-banner');
    if (!banner) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(banner);
    return () => observer.disconnect();
  }, [isRootPath]);

  return (
    <header
      className={cn(
        isRootPath ? 'sticky top-0' : '',
        'z-50 w-full',
        scrolled && 'bg-white',
        className
      )}
    >
      <DesktopHeader
        className="hidden md:flex"
        isRootPath={isRootPath}
        scrolled={scrolled}
        user={user}
      />
      <MobileHeader
        className="flex md:hidden"
        isRootPath={isRootPath}
        scrolled={scrolled}
        user={user}
      />
    </header>
  );
}
