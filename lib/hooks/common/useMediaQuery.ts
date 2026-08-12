'use client';

import { useSyncExternalStore } from 'react';

function subscribe(query: string) {
  return (callback: () => void) => {
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener('change', callback);
    return () => mediaQueryList.removeEventListener('change', callback);
  };
}

/**
 * 미디어쿼리 매치 여부
 * @returns null(미확정, SSR/초기 렌더) | true | false
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => null
  );
}
