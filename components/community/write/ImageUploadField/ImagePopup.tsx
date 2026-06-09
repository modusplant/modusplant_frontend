import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

import { OVERLAY_Z_INDEX } from '@/lib/constants/overlayLayers';
import { useOverlayLifecycle } from '@/lib/hooks/common/useOverlayLifecycle';
import { WriteImageData } from '@/lib/schemas/writeForm';
import { cn } from '@/lib/utils/tailwindHelper';

interface ImagePopupProps {
  image: WriteImageData;
  handleClose: () => void;
  handleThumbnailImage: (id: string) => void;
}

// TODO: Improve reusability by creating a generic Popup component
const ImagePopup = ({
  image,
  handleClose,
  handleThumbnailImage,
}: ImagePopupProps) => {
  const { id, content, isThumbnail } = image;
  const dialogRef = useRef<HTMLDivElement>(null);

  const src = useMemo(() => {
    return typeof content === 'string' ? content : URL.createObjectURL(content);
  }, [content]);

  useOverlayLifecycle({
    isOpen: true,
    onEscape: handleClose,
    initialFocusRef: dialogRef,
  });

  useEffect(() => {
    if (typeof content === 'string') return;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [content, src]);

  return (
    <div
      className={cn(
        'bg-surface-overlay-strong fixed inset-0 touch-none select-none',
        OVERLAY_Z_INDEX.modal
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={handleClose}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="relative w-[800px] max-w-[90vw] focus-visible:outline-none"
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
              'focus-visible:ring-focus-ring text-action-primary-fg absolute top-3 left-10 z-10 cursor-pointer rounded-full px-2 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              isThumbnail ? 'bg-feedback-success' : 'bg-icon-muted'
            )}
            aria-pressed={isThumbnail}
            aria-label="Set as thumbnail image"
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
