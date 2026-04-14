'use client';

import { Image as ImageIcon } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploadButtonProps {
  handleChange: (e: FileList) => void;
}

const ImageUploadButton = ({ handleChange }: ImageUploadButtonProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={(e) => {
          const files = e.target.files;
          if (files) handleChange(files);
          if (ref.current) ref.current.value = '';
        }}
        className="hidden"
        multiple
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          ref.current?.click();
        }}
        className="text-neutral-20 hover:bg-surface-98 flex cursor-pointer items-center gap-1 rounded-[40px] px-3 py-2.25 text-[15px] leading-normal font-medium tracking-[-0.01em] transition-colors"
      >
        <ImageIcon className="h-4.5 w-4.5" />
        사진
      </button>
    </>
  );
};

export default ImageUploadButton;
