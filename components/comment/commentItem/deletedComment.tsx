import ProfileImage from '@/components/_common/profileImage';

interface DeletedCommentProps {
  id?: string;
}

export default function DeletedComment({ id }: DeletedCommentProps) {
  return (
    <div id={id} className="mt-6 flex gap-4">
      <div className="relative h-7.5 w-7.5">
        <ProfileImage />
      </div>

      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-neutral-10 text-[17px] font-semibold">
            작성자
          </span>
        </div>

        <p className="text-neutral-20 mb-2 text-[16px] leading-relaxed whitespace-pre-wrap">
          삭제된 댓글입니다
        </p>
      </div>
    </div>
  );
}
