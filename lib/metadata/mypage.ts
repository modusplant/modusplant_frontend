import type { Metadata } from 'next';

/**
 * 마이페이지 메타데이터 (SEO 불필요 - 개인정보)
 * robots: noindex, nofollow로 검색 엔진 제외
 */
export const mypageMetadata: Metadata = {
  title: '마이페이지 | 모두의식물',
  robots: {
    index: false,
    follow: false,
  },
};
