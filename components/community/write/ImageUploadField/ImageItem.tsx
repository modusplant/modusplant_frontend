import { WriteImageData } from '@/lib/schemas/writeForm';
import { cn } from '@/lib/utils/tailwindHelper';
import { Loader2, RotateCw, X } from 'lucide-react';
import Image from 'next/image';

interface ImageItemProps {
  image: WriteImageData;
  src: string;
  handleDelete: (id: string) => void;
  handleClickImage: () => void;
  handleRetry: (id: string) => void;
}

const ImageItem = ({
  image,
  src,
  handleDelete,
  handleClickImage,
  handleRetry,
}: ImageItemProps) => {
  const { id, status } = image;

  return (
    <div className="group relative h-30 w-30 shrink-0">
      <Image
        onClick={handleClickImage}
        src={src}
        alt={`업로드 이미지 ${id}`}
        className={cn(
          'rounded-lg object-cover',
          status === 'uploading' && 'opacity-50'
        )}
        fill
      />
      {status === 'uploading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}
      {status === 'error' && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRetry(id);
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-lg bg-black/40"
          aria-label="이미지 재업로드"
        >
          <RotateCw className="h-5 w-5 text-white" />
          <span className="text-[10px] text-white">다시 시도</span>
        </button>
      )}
      {image.isThumbnail && (
        <span
          className={cn(
            // TODO: Need to establish a design system
            'absolute top-[10px] left-[12px] z-10 rounded-[9999px] bg-[#57c04e] px-[7px] py-[2px] text-[10.5px] font-medium text-white'
          )}
          aria-label="대표 이미지"
        >
          대표
        </span>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleDelete(id);
        }}
        className="bg-neutral-70 absolute -top-2 -right-2 z-10 rounded-full p-1"
        aria-label="이미지 삭제"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default ImageItem;
