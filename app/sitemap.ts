import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants/apiInstance';
import { PostData } from '@/lib/types/post';
import { POST_ENDPOINTS } from '@/lib/constants/endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 최근 게시글 가져오기 (인증 없이 공개 API 직접 호출)
    const response = await fetch(`${BASE_URL}${POST_ENDPOINTS.POSTS}?size=50`, {
      next: { revalidate: 3600 }, // 1시간마다 재생성
    });
    const result = await response.json();
    const posts = result.data?.posts || [];

    // 게시글 URL 생성
    const postUrls: MetadataRoute.Sitemap = posts.map((post: PostData) => ({
      url: `${BASE_URL}${POST_ENDPOINTS.POST_DETAIL(post.postId)}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [
      // 홈페이지 (최우선)
      {
        url: BASE_URL || '',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      // 모든 게시글
      ...postUrls,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // 에러 발생 시 기본 페이지만 반환
    return [
      {
        url: BASE_URL || '',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
