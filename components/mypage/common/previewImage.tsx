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
    <div
      className={cn(
        'relative h-[100px] w-[100px] shrink-0 md:h-[140px] md:w-[140px]',
        className
      )}
    >
      <Image
        width={140}
        height={140}
        src={previewUrl}
        alt="이미지 미리보기"
        className="border-surface-stroke-2 h-100 h-140 h-full w-100 w-full rounded-[7px] border object-cover md:w-140"
      />
      <button
        onClick={onRemove}
        className="bg-neutral-70 hover:bg-neutral-80 absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white transition-colors"
        type="button"
        aria-label="첨부 이미지 삭제"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default PreviewImage;
