import { Metadata } from 'next';

/**
 * 사이트 기본 설정
 */
export const SITE_CONFIG = {
  name: '모두의식물',
  domain: 'https://modusplant.kr',
  defaultImage: '/logo_favicon/og-image-v2.png',
  description: '식물에 관심 있는 사용자들을 위한 정보 제공 플랫폼',
} as const;

/**
 * 기본 메타데이터 생성 헬퍼
 */
export function createMetadata({
  title,
  description,
  path = '',
  images,
  keywords,
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  images?: string[];
  keywords?: string[];
  type?: 'website' | 'article';
}): Metadata {
  const url = `${SITE_CONFIG.domain}${path}`;
  const ogImages = images || [SITE_CONFIG.defaultImage];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: ogImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      })),
      type,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 텍스트를 메타데이터 설명으로 변환 (길이 제한)
 */
export function createDescription(text: string, maxLength = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength)}...`
    : cleaned;
}

/**
 * 게시글 제목 포맷
 */
export function formatPostTitle(title: string): string {
  return `${title} | ${SITE_CONFIG.name}`;
}
