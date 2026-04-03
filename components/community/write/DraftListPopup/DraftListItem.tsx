import { DraftPostData } from '@/lib/types/post';
import { formatDate } from 'date-fns';
import { Trash2 as IcTrash } from 'lucide-react';

interface DraftListItemProps {
  draftPost: DraftPostData;
  onClick: (draftPostId: string) => void;
  onDelete: (draftPostId: string) => void;
}

const DraftListItem = ({
  draftPost,
  onClick,
  onDelete,
}: DraftListItemProps) => {
  const { title, updatedAt, postId } = draftPost;

  return (
    <li className="border-surface-stroke flex items-center gap-3 border-b-[1px] last:border-0">
      <div
        className="flex-1 cursor-pointer flex-col justify-center py-4"
        onClick={() => onClick(postId)}
      >
        <p className="text-neutral-10 line-clamp-1 text-[15px] font-semibold">
          {title?.trim() || '(제목 없음)'}
        </p>
        <span className="text-neutral-60 shrink-0 text-xs">
          {formatDate(updatedAt, 'yyyy.MM.dd HH:mm')}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onDelete(postId);
        }}
        className="hover:bg-surface-98 text-neutral-40 rounded-sm p-1"
        aria-label={`임시저장 글 "${title}" 삭제`}
      >
        <IcTrash className="h-5 w-5" />
      </button>
    </li>
  );
};

export default DraftListItem;
