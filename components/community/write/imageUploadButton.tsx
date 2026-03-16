'use client';

import { Image as ImageIcon } from 'lucide-react';
import { RefObject } from 'react';

interface ImageUploadButtonProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadButton({
  fileInputRef,
  onFileSelect,
}: ImageUploadButtonProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        onChange={onFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-neutral-20 hover:bg-surface-98 flex cursor-pointer items-center gap-1 rounded-[40px] px-3 py-2.25 text-[15px] leading-normal font-medium tracking-[-0.01em] transition-colors"
      >
        <ImageIcon className="h-4.5 w-4.5" />
        사진
      </button>
    </>
  );
}
