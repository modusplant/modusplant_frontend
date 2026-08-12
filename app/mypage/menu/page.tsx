'use client';

import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/lib/hooks/common/useMediaQuery';
import { useEffect } from 'react';

export default function MypageMenu() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    if (isMobile === false) {
      router.replace('/mypage/profile');
    }
  }, [isMobile, router]);

  return null;
}
