import { WriteImageData } from '@/lib/schemas/writeForm';
import { cn } from '@/lib/utils/tailwindHelper';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageItemProps {
  image: WriteImageData;
  src: string;
  handleDelete: (id: string) => void;
  handleClickImage: () => void;
}

const ImageItem = ({
  image,
  src,
  handleDelete,
  handleClickImage,
}: ImageItemProps) => {
  const { id } = image;

  return (
    <div className="group relative h-30 w-30 shrink-0">
      <Image
        onClick={handleClickImage}
        src={src}
        alt={`업로드 이미지 ${id}`}
        className="rounded-lg object-cover"
        fill
      />
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
