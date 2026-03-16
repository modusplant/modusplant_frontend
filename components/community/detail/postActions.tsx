'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Bookmark, EllipsisVertical } from 'lucide-react';
import { postApi } from '@/lib/api/client/post';
import { useAuthStore } from '@/lib/store/authStore';
import { showModal } from '@/lib/store/modalStore';
import { usePostInteraction } from '@/lib/hooks/community/usePostInteraction';
import Dropdown from '@/components/_common/dropdown';

interface PostActionsProps {
  postId: string;
  authorId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
}

export default function PostActions({
  postId,
  authorId,
  initialLikeCount,
  initialIsLiked,
  initialIsBookmarked,
}: PostActionsProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // 본인 게시글 여부 확인
  const isAuthor = user?.id === authorId;

  const handleEdit = () => {
    router.push(`/community/write/edit/${postId}`);
  };

  const handleDelete = async () => {
    showModal({
      title: '게시글을 삭제하시겠습니까?',
      description: '삭제된 게시글은 복구할 수 없습니다.',
      type: 'two-button',
      buttonText: '삭제',
      onConfirm: confirmDelete,
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await postApi.deletePost(postId);
      showModal({
        description: '게시글이 성공적으로 삭제되었습니다.',
        type: 'snackbar',
      });
      router.replace('/');
    } catch (error) {
      showModal({
        title: '게시글 삭제 실패',
        description: '게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
        type: 'one-button',
        buttonText: '확인',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* 좋아요/북마크 버튼 */}
      <div className="text-neutral-60 flex w-full items-center justify-between text-lg">
        {/* 좋아요 */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="group flex cursor-pointer items-center gap-1.5"
        >
          <Heart
            className={`h-5 w-5 transition-all ${
              isLiked ? '' : 'group-hover:fill-neutral-90'
            }`}
            color={isLiked ? 'red' : '#919191'}
            fill={isLiked ? 'red' : 'none'}
          />
          <span>{likeCount.toLocaleString()}</span>
        </button>
        {/* 북마크 */}
        <button
          onClick={handleBookmark}
          disabled={isBookmarking}
          className="group flex cursor-pointer items-center gap-1.5"
        >
          <Bookmark
            className={`h-5 w-5 transition-all ${
              isBookmarked ? '' : 'group-hover:fill-neutral-90'
            }`}
            fill={isBookmarked ? '#3a972e' : 'none'}
            color={isBookmarked ? '#3a972e' : '#919191'}
          />
        </button>
      </div>

      {/* 수정/삭제 버튼 (작성자만) */}
      {isAuthor && (
        <Dropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          trigger={
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
              aria-label="게시글 옵션"
            >
              <EllipsisVertical className="text-neutral-60 h-5 w-5" />
            </button>
          }
          items={[
            {
              label: '수정',
              onClick: handleEdit,
            },
            {
              label: '삭제',
              onClick: handleDelete,
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
