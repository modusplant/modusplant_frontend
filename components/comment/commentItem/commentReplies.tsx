import { Comment } from '@/lib/types/comment';

interface CommentRepliesProps {
  children: Comment[];
  postId: string;
  onUpdate: () => void;
  CommentItemComponent: React.ComponentType<{
    comment: Comment;
    postId: string;
    onUpdate: () => void;
  }>;
}

export default function CommentReplies({
  children,
  postId,
  onUpdate,
  CommentItemComponent,
}: CommentRepliesProps) {
  if (!children || children.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 ml-14 space-y-4">
      {children.map((childComment) => (
        <CommentItemComponent
          key={childComment.path}
          comment={childComment}
          postId={postId}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
