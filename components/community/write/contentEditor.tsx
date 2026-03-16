'use client';

import { memo } from 'react';
import ImageUploader from './imageUploader';

interface ContentEditorProps {
  textContent: string;
  images: (File | string)[];
  onTextChange: (text: string) => void;
  onImagesChange: (images: (File | string)[]) => void;
}

function ContentEditor({
  textContent,
  images,
  onTextChange,
  onImagesChange,
}: ContentEditorProps) {
  return (
    <div className="border-surface-stroke flex w-full flex-col self-stretch rounded-[10px] border">
      {/* 본문 입력 영역 */}
      <div className="flex flex-1 flex-col gap-2.5 self-stretch p-5">
        <textarea
          value={textContent}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="내용을 입력해주세요."
          className="text-neutral-20 placeholder:text-neutral-60 h-full min-h-75 resize-none text-base leading-[1.8] font-normal tracking-[-0.01em] focus:outline-none"
        />
      </div>
      {/* 이미지 업로드 섹션 */}
      <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch border-t px-4 py-3.5">
        <ImageUploader images={images} onImagesChange={onImagesChange} />
      </div>
    </div>
  );
}

// React.memo로 불필요한 리렌더링 방지
export default memo(ContentEditor);
