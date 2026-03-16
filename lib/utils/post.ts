import { PostData, ContentPart } from '@/lib/types/post';
import { getFullImageUrl } from '@/lib/utils/image';
import Post1 from '@/public/post/image_01.png';
import Post2 from '@/public/post/image_02.png';
import Post3 from '@/public/post/image_03.png';
import Post4 from '@/public/post/image_04.png';

/**
 * 썸네일 추출 헬퍼 함수
 * - content 배열에서 첫 번째 이미지를 찾아 반환
 * - 이미지가 없으면 postId 기반으로 일관된 랜덤 이미지 반환
 */
export function getThumbnail(post: PostData): string {
  const imageContent = post.content.find((c) => c.type === 'image');

  if (imageContent?.src) {
    return imageContent.src;
  }

  // postId의 마지막 문자를 사용하여 1-4 사이의 숫자로 변환
  const lastChar = post.postId.slice(-1);
  const charCode = lastChar.charCodeAt(0);
  const imageNumber = (charCode % 4) + 1;

  const defaultImages = [Post1, Post2, Post3, Post4];

  return defaultImages[imageNumber - 1].src;
}

/**
 * 텍스트 콘텐츠만 필터링
 * - content 배열에서 type이 "text"인 항목들만 반환
 */
export function getTextContent(content: ContentPart[]): string {
  return content.find((item) => item.type === 'text')?.data || '';
}

/**
 * 이미지 콘텐츠만 필터링
 * - content 배열에서 type이 "image"인 항목들만 반환
 */
export function getImageContent(content: ContentPart[]): ContentPart[] {
  return content
    .filter((item) => item.type === 'image')
    .map((item) => ({
      ...item,
      src: getFullImageUrl(item.src),
    }));
}
