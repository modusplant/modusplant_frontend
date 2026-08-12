import Link from 'next/link';
import { MyComment } from '@/lib/types/comment';
import { formatRelativeTime } from '@/lib/utils/formatTime';

interface MyCommentItemProps {
  comment: MyComment;
}

export default function MyCommentItem({ comment }: MyCommentItemProps) {
  const { content, createdAt, postTitle, postId, totalCommentsOfPost } =
    comment;

  return (
    <Link href={`/community/${postId}`} className="block bg-neutral-100">
      <div className="flex flex-col gap-1.5">
        {/* 댓글 내용 */}
        <p className="text-neutral-20 line-clamp-2 text-[15px] leading-normal font-medium tracking-[-0.01em]">
          {content}
        </p>

        <span className="text-neutral-60 text-xs">
          {formatRelativeTime(createdAt)}
        </span>

        {/* 게시글 제목 */}
        <div className="flex items-center gap-1.5 text-sm tracking-[-0.03em]">
          <span className="text-neutral-40 font-regular truncate">
            {postTitle}
          </span>
          <span className="text-primary-50 font-medium">
            [{totalCommentsOfPost}]
          </span>
        </div>
      </div>
    </Link>
  );
}
