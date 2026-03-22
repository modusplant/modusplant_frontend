import { Metadata } from 'next';
import { createMetadata, SITE_CONFIG } from './helpers';

/**
 * 홈페이지 메타데이터
 */
export const homeMetadata: Metadata = createMetadata({
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  path: '/',
  keywords: [
    '식물 키우기',
    '반려식물',
    '식물 커뮤니티',
    '가드닝',
    '식물 관리',
    '분갈이',
    '병충해',
    '관엽식물',
    '다육식물',
    '베고니아',
    '아글라오네마',
  ],
  type: 'website',
});
