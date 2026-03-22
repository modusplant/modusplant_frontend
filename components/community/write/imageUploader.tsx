'use client';

import { memo } from 'react';
import useImageUpload from '@/lib/hooks/community/useImageUpload';
import ImagePreviewItem from './imagePreviewItem';
import ImageDropZone from './imageDropZone';
import ImageUploadButton from './imageUploadButton';

interface ImageUploaderProps {
  images: (File | string)[];
  onImagesChange: (images: (File | string)[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
}

function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeInMB = 10,
}: ImageUploaderProps) {
  const {
    fileInputRef,
    isDragging,
    handleFileSelect,
    handleRemoveImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageUpload({ maxImages, maxSizeInMB, onImagesChange, images });

  return (
    <div className="w-full">
      {/* 이미지 업로드 버튼 */}
      <ImageUploadButton
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
      />

      {/* 이미지 미리보기 + 스크롤 */}
      {images.length > 0 && (
        <div
          className={`mt-4 overflow-x-auto rounded-lg pb-2 ${
            isDragging
              ? 'border-primary-50 bg-primary-10'
              : 'border-surface-stroke'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex min-w-min gap-3 px-2 py-2">
            {images.map((image, index) => (
              <ImagePreviewItem
                key={`image-${index}`}
                file={image}
                index={index}
                onRemove={(idx) => handleRemoveImage(idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 드래그 앤 드롭 안내 */}
      {images.length === 0 && (
        <ImageDropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}
    </div>
  );
}

// React.memo로 불필요한 리렌더링 방지
export default memo(ImageUploader);
