'use client';

import Image from 'next/image';
import { getThumbnail } from '@/lib/utils/post';
import { PostData } from '@/lib/types/post';

export interface PostListItemThumbnailProps {
  post: PostData;
}

/**
 * 게시글 리스트 아이템 - 썸네일 이미지 영역
 * - 콘텐츠에서 추출한 첫 이미지 표시
 * - 100x100px 크기로 고정
 */
export default function PostListItemThumbnail({
  post,
}: PostListItemThumbnailProps) {
  const thumbnail = getThumbnail(post);

  if (!thumbnail) {
    return null;
  }

  return (
    <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded-lg">
      <Image
        src={thumbnail}
        alt={post.title}
        fill
        className="object-cover"
        sizes="100px"
      />
    </div>
  );
}
