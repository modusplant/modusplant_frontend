'use client';

import { Heart, MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatTime';
import Button from '@/components/_common/button';

interface CommentActionsProps {
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  onLike: () => void;
  onReplyClick: () => void;
  isUpdateMode: boolean;
  handleUpdateModeInActive: () => void;
  handleUpdateRequestSend: () => void;
}

export default function CommentActions({
  createdAt,
  updatedAt,
  likeCount,
  isLiked,
  isLiking,
  onLike,
  onReplyClick,
  isUpdateMode,
  handleUpdateModeInActive,
  handleUpdateRequestSend,
}: CommentActionsProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-neutral-60 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span>{formatRelativeTime(updatedAt || createdAt)}</span>
          {updatedAt && (
            <>
              <span>&middot;</span>
              <span>수정됨</span>
            </>
          )}
        </div>
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
      {isUpdateMode && (
        <div className="flex justify-end gap-2 pr-10">
          <Button
            variant="secondary"
            className="rounded-[9px]"
            onClick={handleUpdateModeInActive}
          >
            취소
          </Button>
          <Button
            variant="point"
            className="rounded-[9px]"
            onClick={handleUpdateRequestSend}
          >
            저장
          </Button>
        </div>
      )}
    </div>
  );
}
