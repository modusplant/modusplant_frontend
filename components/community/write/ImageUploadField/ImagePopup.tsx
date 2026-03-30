import { useEffect, useMemo } from 'react';
import Image from 'next/image';

import { WriteImageData } from '@/lib/schemas/writeForm';
import { cn } from '@/lib/utils/tailwindHelper';

interface ImagePopupProps {
  image: WriteImageData;
  handleClose: () => void;
  handleThumbnailImage: (id: string) => void;
}

const ImagePopup = ({
  image,
  handleClose,
  handleThumbnailImage,
}: ImagePopupProps) => {
  const { id, content, isThumbnail } = image;

  const src = useMemo(() => {
    return typeof content === 'string' ? content : URL.createObjectURL(content);
  }, [content]);

  useEffect(() => {
    if (typeof content === 'string') return;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [content, src]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevUserSelect = document.body.style.userSelect;

    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.userSelect = prevUserSelect;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] touch-none bg-black/60 select-none"
      onClick={handleClose}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div
          className="relative w-[800px] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleThumbnailImage(id);
            }}
            className={cn(
              'absolute top-3 left-10 z-10 cursor-pointer rounded-full px-2 py-1 text-xs font-medium text-white',
              isThumbnail ? 'bg-[#57c04e]' : 'bg-neutral-70'
            )}
          >
            대표
          </button>
          <Image
            src={src}
            alt="팝업 이미지"
            width={1200}
            height={800}
            draggable={false}
            className="block h-auto max-h-[90vh] w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
