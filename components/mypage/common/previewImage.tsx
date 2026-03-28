import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';

interface PreviewImageProps {
  previewUrl: string;
  onRemove: () => void;
  className?: string;
}

/**
 * 이미지 미리보기 컴포넌트
 * @param previewUrl - 이미지 미리보기 URL
 * @param onRemove - 이미지 삭제 함수
 * @param className - 추가 스타일
 */
const PreviewImage = ({
  previewUrl,
  onRemove,
  className,
}: PreviewImageProps) => {
  return (
    <div className={cn('relative h-[140px] w-[140px] shrink-0', className)}>
      <Image
        width={140}
        height={140}
        src={previewUrl}
        alt="이미지 미리보기"
        className="border-surface-stroke-2 h-full w-full rounded-[7px] border object-cover"
      />
      <button
        onClick={onRemove}
        className="bg-neutral-70 hover:bg-neutral-80 absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white transition-colors"
        type="button"
        aria-label="첨부 이미지 삭제"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default PreviewImage;
