import { Comment } from '@/lib/types/comment';

interface CommentRepliesProps {
  children: Comment[];
  postId: string;
  refetch: () => void;
  CommentItemComponent: React.ComponentType<{
    comment: Comment;
    postId: string;
    refetch: () => void;
    rootChildrenCount?: number;
  }>;
  /** 최상위 댓글(root)의 children 개수. 재계산하지 않고 그대로 자손에게 물려준다. */
  rootChildrenCount?: number;
}

export default function CommentReplies({
  children,
  postId,
  refetch,
  CommentItemComponent,
  rootChildrenCount,
}: CommentRepliesProps) {
  if (!children || children.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 ml-7.5 space-y-4 md:ml-14">
      {children.map((childComment) => (
        <CommentItemComponent
          key={childComment.path}
          comment={childComment}
          postId={postId}
          refetch={refetch}
          rootChildrenCount={rootChildrenCount} // 재계산 없이 그대로 전달
        />
      ))}
    </div>
  );
}
