'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types/comment';
import { useAuthStore } from '@/lib/store/authStore';
import { useCommentLike } from '@/lib/hooks/comment/useCommentLike';
import { useCommentMutations } from '@/lib/hooks/comment/useCommentMutations';
import CommentInput from './commentInput';
import ProfileImage from '@/components/_common/profileImage';
import DeletedComment from './commentItem/deletedComment';
import CommentHeader from './commentItem/commentHeader';
import CommentContent from './commentItem/commentContent';
import CommentActions from './commentItem/commentActions';
import CommentReplies from './commentItem/commentReplies';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onUpdate: () => void;
}

export default function CommentItem({
  comment,
  postId,
  onUpdate,
}: CommentItemProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const isMyComment = isAuthenticated && user?.nickname === comment.nickname;

  // 좋아요 훅
  const { likeCount, isLiked, isLiking, handleLike } = useCommentLike({
    postId,
    commentPath: comment.path,
    initialLikeCount: comment.likeCount,
    initialIsLiked: comment.isLiked,
  });
  console.log(isMyComment);

  // 삭제 훅
  const { deleteComment, isDeleting, updateComment, isUpdating } =
    useCommentMutations({
      postId,
      onSuccess: onUpdate,
    });

  const handleDelete = () => {
    deleteComment({ commentPath: comment.path });
  };

  const handleUpdate = () => {
    setIsUpdateMode(true);
    // updateComment({ content: '답글 수정 API 테스트', path: comment.path });
  };

  return (
    <>
      {comment.isDeleted ? (
        <DeletedComment />
      ) : (
        <div className="mt-6 flex gap-4">
          <div className="relative h-7.5 w-7.5">
            <ProfileImage imageSrc={comment.profileImagePath} />
          </div>

          <div className="w-full">
            <CommentHeader
              nickname={comment.nickname}
              profileImagePath={comment.profileImagePath}
              isMyComment={isMyComment}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isDeleting={isDeleting}
            />

            <CommentContent content={comment.content} />

            <CommentActions
              createdAt={comment.createdAt}
              likeCount={likeCount}
              isLiked={isLiked}
              isLiking={isLiking}
              onLike={handleLike}
              onReplyClick={() => setShowReplyForm(!showReplyForm)}
            />

            {/* 답글 작성 입력창 */}
            {showReplyForm && (
              <div className="mt-4">
                <CommentInput
                  postId={postId}
                  parentPath={comment.path}
                  siblingCount={comment.children?.length || 0}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    onUpdate();
                  }}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <CommentReplies
        children={comment.children || []}
        postId={postId}
        onUpdate={onUpdate}
        CommentItemComponent={CommentItem}
      />
    </>
  );
}
