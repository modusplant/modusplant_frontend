import { Metadata } from 'next';
import { createMetadata, createDescription, formatPostTitle } from './helpers';
import { PostDetail } from '@/lib/types/post';

/**
 * 게시글 상세 페이지 메타데이터 생성
 */
export function createPostMetadata(post: PostDetail): Metadata {
  // 텍스트 콘텐츠 추출
  const textContent = post.content
    .filter((c) => c.type === 'text')
    .map((c) => c.data)
    .join(' ');

  // 이미지 URL 추출
  const imageUrls = post.content
    .filter((c) => c.type === 'image' && c.src)
    .map((c) => c.src!)
    .slice(0, 1); // 첫 번째 이미지만

  return createMetadata({
    title: formatPostTitle(post.title),
    description: createDescription(textContent, 160),
    path: `/community/${post.postId}`,
    images: imageUrls.length > 0 ? imageUrls : undefined,
    keywords: [
      post.title,
      post.primaryCategory,
      post.secondaryCategory,
      '식물 키우기',
      '식물 커뮤니티',
    ],
    type: 'article',
  });
}

/**
 * 게시글을 찾을 수 없을 때 메타데이터
 */
export const notFoundPostMetadata: Metadata = {
  title: '게시글을 찾을 수 없습니다 | 모두의식물',
  description: '요청하신 게시글을 찾을 수 없습니다.',
};

/**
 * 게시글 에러 메타데이터
 */
export const errorPostMetadata: Metadata = {
  title: '게시글 | 모두의식물',
  description: '게시글을 불러오는 중 오류가 발생했습니다.',
};
