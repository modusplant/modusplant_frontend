import { PreviewImage } from '@/lib/types/write';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

interface ImagePreviewItemProps {
  preview: PreviewImage;
  onRemove: (id: string) => void;
}

const ImagePreviewItem = ({ preview, onRemove }: ImagePreviewItemProps) => {
  const { id, file } = preview;

  const previewUrl =
    typeof file === 'string' ? file : URL.createObjectURL(file);

  useEffect(() => {
    //  revokeObjectURL when the component unmounts to prevent memory leaks
    return () => {
      if (typeof file === 'string') return;
      URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);

  return (
    <div className="group relative h-30 w-30 shrink-0">
      <Image
        src={previewUrl}
        alt={`업로드 이미지 ${id}`}
        className="rounded-lg object-cover"
        fill
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(id);
        }}
        className="bg-neutral-70 absolute -top-2 -right-2 z-10 rounded-full p-1"
        aria-label="이미지 삭제"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default ImagePreviewItem;
