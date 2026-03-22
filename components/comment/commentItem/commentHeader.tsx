'use client';

import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import ProfileImage from '@/components/_common/profileImage';
import Dropdown from '@/components/_common/dropdown';

interface CommentHeaderProps {
  nickname: string;
  profileImagePath?: string;
  isMyComment: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function CommentHeader({
  nickname,
  profileImagePath,
  isMyComment,
  onDelete,
  isDeleting,
}: CommentHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-neutral-10 text-[17px] font-semibold">
        {nickname}
      </span>

      {isMyComment && (
        <Dropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          trigger={
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              aria-label="댓글 옵션"
            >
              <EllipsisVertical className="text-neutral-60 h-4 w-4" />
            </button>
          }
          items={[
            {
              label: '삭제',
              onClick: onDelete,
              disabled: isDeleting,
            },
          ]}
          position="right"
          width="w-24"
        />
      )}
    </div>
  );
}
