import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://modusplant.kr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/mypage/', '/(auth)/', '/reset-password/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/mypage/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
