'use client';

import { PostData } from '@/lib/types/post';
import { formatRelativeTime } from '@/lib/utils/formatTime';
import { Bookmark, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';
import { usePostInteraction } from '@/lib/hooks/community/usePostInteraction';

export interface PostListItemMetadataProps {
  post: PostData;
}

/**
 * 게시글 리스트 아이템 - 메타 정보 영역
 * - 1차 카테고리
 * - 좋아요 수
 * - 댓글 수
 * - 북마크 상태
 * - 게시 날짜
 */
export default function PostListItemMetadata({
  post,
}: PostListItemMetadataProps) {
  const {
    postId,
    isLiked: initialIsLiked,
    isBookmarked: initialIsBookmarked,
    likeCount: initialLikeCount,
  } = post;

  const {
    likeCount,
    isLiked,
    isLiking,
    handleLike,
    isBookmarked,
    isBookmarking,
    handleBookmark,
  } = usePostInteraction({
    postId,
    initialLikeCount,
    initialIsLiked,
    initialIsBookmarked,
  });

  const formattedDate = formatRelativeTime(post.publishedAt);

  return (
    <div className="text-neutral-60 flex flex-wrap items-center text-[11px] leading-[1.2] tracking-[-0.02em] whitespace-nowrap sm:gap-2 md:text-xs">
      <div className="flex items-center gap-2 md:gap-2">
        {/* 1차 카테고리 */}
        <span>{post.primaryCategory}</span>

        {/* 좋아요 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          className="flex items-center gap-1.5 md:gap-1"
          disabled={isLiking}
        >
          <Heart
            className="h-3 w-3 md:h-4 md:w-4"
            color={isLiked ? 'red' : 'currentColor'}
            fill={isLiked ? 'red' : 'none'}
          />
          <span>{likeCount || initialLikeCount}</span>
        </button>

        {/* 댓글 */}
        <span className="flex items-center gap-1.5 md:gap-1">
          <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
          <span>{post.commentCount}</span>
        </span>

        {/* 북마크 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleBookmark();
          }}
          disabled={isBookmarking}
        >
          <Bookmark
            fill={isBookmarked ? 'currentColor' : 'none'}
            className={cn(
              'h-3 w-3 md:h-4 md:w-4',
              isBookmarked ? 'text-primary-50' : 'text-neutral-60'
            )}
          />
        </button>
      </div>

      {/* 날짜 */}
      <span>{formattedDate}</span>
    </div>
  );
}
