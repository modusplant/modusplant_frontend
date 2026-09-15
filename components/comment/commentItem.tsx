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
  rootChildrenCount?: number;
}

export default function CommentItem({
  comment,
  postId,
  refetch,
  rootChildrenCount,
}: CommentItemProps) {
  // 답글 path/개수 계산은 항상 "내가 속한 최상위 댓글(root)의 children 개수" 기준으로 해야 한다.
  // 내가 root(depth 0)면 내 children 개수가 곧 그 값이고, root의 자손이면 재귀를 타고
  // 내려오며 전달받은 rootChildrenCount를 그대로 쓴다(자손 자신의 children 개수를 세면 안 됨).
  const resolvedRootChildrenCount =
    comment.depth === 0
      ? comment.children?.length || 0
      : (rootChildrenCount ?? 0);

  const {
    content: initialContent,
    createdAt,
    isDeleted,
    isLiked: initialIsLiked,
    likeCount: initialLikeCount,
    nickname,
    path,
    profileImagePath,
    editedAt,
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
  const { deleteComment, isDeleting, updateComment } = useCommentMutations({
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

  return (
    <>
      {isDeleted ? (
        <DeletedComment id={comment.path} />
      ) : (
        <div id={comment.path} className="mt-6 flex gap-4">
          <div className="relative h-7.5 w-7.5">
            <ProfileImage imageSrc={profileImagePath} />
          </div>

          <div className="flex-1">
            <CommentHeader
              nickname={nickname}
              postUlid={postId}
              path={path}
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
              editedAt={editedAt}
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
                  siblingCount={resolvedRootChildrenCount}
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
        postId={postId}
        refetch={refetch}
        CommentItemComponent={CommentItem}
        rootChildrenCount={resolvedRootChildrenCount}
      >
        {children || []}
      </CommentReplies>
    </>
  );
}
