'use client';

import React, { useState } from 'react';
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
import { Input } from '@/components/_common/input';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  refetch: () => void;
}

export default function CommentItem({
  comment,
  postId,
  refetch,
}: CommentItemProps) {
  const {
    content: initialContent,
    createdAt,
    isDeleted,
    isLiked: initialIsLiked,
    likeCount: initialLikeCount,
    nickname,
    path,
    profileImagePath,
    updatedAt,
    children,
  } = comment;
  const { user, isAuthenticated } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatingComment, setUpdatingComment] = useState(comment.content);
  const isMyComment = isAuthenticated && user?.nickname === comment.nickname;

  // 좋아요 훅
  const { likeCount, isLiked, isLiking, handleLike } = useCommentLike({
    postId,
    commentPath: path,
    initialLikeCount,
    initialIsLiked,
  });

  // 삭제 훅
  const { deleteComment, isDeleting, updateComment, isUpdating } =
    useCommentMutations({
      postId,
      onSuccess: refetch,
    });

  const handleDelete = () => {
    deleteComment({ commentPath: path });
  };

  const handleUpdateModeActive = () => {
    setIsUpdateMode(true);
  };

  const handleUpdateModeInActive = () => {
    setUpdatingComment(initialContent);
    setIsUpdateMode(false);
  };

  const handleUpdateRequestSend = () => {
    if (updateComment.length < 1) {
      return;
    }

    if (updatingComment === initialContent) {
      handleUpdateModeInActive();
      return;
    }
    updateComment({ content: updatingComment, path });
    handleUpdateModeInActive();
  };

  const onChangeUpdatingComment = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdatingComment(event.target.value);
  };

  const isUpdated =
    new Date(updatedAt).getTime() > new Date(createdAt).getTime();

  return (
    <>
      {isDeleted ? (
        <DeletedComment />
      ) : (
        <div className="mt-6 flex gap-4">
          <div className="relative h-7.5 w-7.5">
            <ProfileImage imageSrc={profileImagePath} />
          </div>

          <div className="w-full">
            <CommentHeader
              nickname={nickname}
              profileImagePath={profileImagePath}
              isMyComment={isMyComment}
              onDelete={handleDelete}
              onUpdate={handleUpdateModeActive}
              isDeleting={isDeleting}
            />

            <div className="mb-2.5">
              {isUpdateMode ? (
                <div className="flex-col gap-2.5 pr-10">
                  <Input
                    defaultValue={updatingComment}
                    onChange={onChangeUpdatingComment}
                    error={updatingComment.length < 1}
                  />
                </div>
              ) : (
                <CommentContent content={initialContent} />
              )}
            </div>

            <CommentActions
              createdAt={createdAt}
              updatedAt={updatedAt}
              isUpdated={isUpdated}
              likeCount={likeCount}
              isLiked={isLiked}
              isLiking={isLiking}
              onLike={handleLike}
              onReplyClick={() => setShowReplyForm(!showReplyForm)}
              isUpdateMode={isUpdateMode}
              handleUpdateModeInActive={handleUpdateModeInActive}
              handleUpdateRequestSend={handleUpdateRequestSend}
            />

            {/* 답글 작성 입력창 */}
            {showReplyForm && (
              <div className="mt-4">
                <CommentInput
                  postId={postId}
                  parentPath={path}
                  siblingCount={children?.length || 0}
                  refetch={() => {
                    setShowReplyForm(false);
                    refetch();
                  }}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <CommentReplies
        children={children || []}
        postId={postId}
        refetch={refetch}
        CommentItemComponent={CommentItem}
      />
    </>
  );
}
