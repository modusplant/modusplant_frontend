import { Metadata } from 'next';
import { SITE_CONFIG } from './helpers';

/**
 * 루트 레이아웃 메타데이터 (기본 설정)
 */
export const layoutMetadata: Metadata = {
  metadataBase: new URL('https://modusplant.kr'),
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  icons: {
    icon: '/logo_favicon/favicon_v2_green.svg',
  },
};
