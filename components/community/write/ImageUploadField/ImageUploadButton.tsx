'use client';

import { Image as ImageIcon } from 'lucide-react';
import { RefObject } from 'react';

interface ImageUploadButtonProps {
  ref: RefObject<HTMLInputElement | null>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButton = ({ ref, handleChange }: ImageUploadButtonProps) => {
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleChange}
        className="hidden"
        multiple
      />
      <button
        onClick={(e) => {
          // prevent default action to avoid form submission when the button is inside a form
          e.preventDefault();
          fileInputRef.current?.click();
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
