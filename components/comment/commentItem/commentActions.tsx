'use client';

import { Heart, MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatTime';

interface CommentActionsProps {
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  onLike: () => void;
  onReplyClick: () => void;
}

export default function CommentActions({
  createdAt,
  likeCount,
  isLiked,
  isLiking,
  onLike,
  onReplyClick,
}: CommentActionsProps) {
  return (
    <div className="text-neutral-60 flex items-center gap-4 text-sm">
      <span>{formatRelativeTime(createdAt)}</span>

      <button
        onClick={onLike}
        disabled={isLiking}
        className="group flex cursor-pointer items-center gap-1"
      >
        <Heart
          className={`h-4 w-4 transition-all ${
            isLiked ? '' : 'group-hover:fill-neutral-90'
          }`}
          color={isLiked ? 'red' : '#919191'}
          fill={isLiked ? 'red' : 'none'}
        />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={onReplyClick}
        className="text-neutral-60 hover:text-primary-50 flex items-center gap-1 transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        답글 쓰기
      </button>
    </div>
  );
}
