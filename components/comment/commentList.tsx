'use client';

import { Comment } from '@/lib/types/comment';
import CommentItem from './commentItem';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  refetch: () => void;
}

export default function CommentList({
  comments,
  postId,
  refetch,
}: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.path}
          comment={comment}
          postId={postId}
          refetch={refetch}
        />
      ))}
    </div>
  );
}
