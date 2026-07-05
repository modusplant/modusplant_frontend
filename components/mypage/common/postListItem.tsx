'use client';

import Link from 'next/link';
import { PostData } from '@/lib/types/post';
import PostListItemContent from './postListItemContent';
import PostListItemMetadata from './postListItemMetadata';
import PostListItemThumbnail from './postListItemThumbnail';

export interface PostListItemProps {
  post: PostData;
}

/**
 * 게시글 리스트 아이템 컴포넌트
 * - 왼쪽: PostListItemContent (카테고리, 제목, 본문 일부)
 * - 오른쪽: PostListItemThumbnail (썸네일 이미지)
 * - 하단: PostListItemMetadata (카테고리, 좋아요, 댓글, 북마크, 날짜)
 */
export default function PostListItem({ post }: PostListItemProps) {
  return (
    <Link
      href={`/community/${post.postId}`}
      className="group flex items-center gap-6 py-0.5"
    >
      {/* 왼쪽: 콘텐츠 영역 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <PostListItemContent post={post} />
        <PostListItemMetadata post={post} />
      </div>

      {/* 오른쪽: 썸네일 이미지 */}
      <PostListItemThumbnail post={post} />
    </Link>
  );
}
