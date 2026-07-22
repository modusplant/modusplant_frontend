import { useState } from 'react';
import { WriteImageData } from '@/lib/schemas/writeForm';

export const useImagePreviewUrls = (images: WriteImageData[]) => {
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(
    new Map()
  );
  const [syncedImages, setSyncedImages] = useState(images);

  // images가 바뀔 때(추가/삭제) 같은 렌더 안에서 blob URL 캐시를 동기화한다.
  if (images !== syncedImages) {
    const next = new Map(previewUrls);
    const currentIds = new Set(images.map((image) => image.id));

    previewUrls.forEach((url, id) => {
      if (!currentIds.has(id)) {
        URL.revokeObjectURL(url);
        next.delete(id);
      }
    });

    images.forEach((image) => {
      if (typeof image.content !== 'string' && !next.has(image.id)) {
        next.set(image.id, URL.createObjectURL(image.content));
      }
    });

    setSyncedImages(images);
    setPreviewUrls(next);
  }

  const getPreviewUrl = (image: WriteImageData) =>
    typeof image.content === 'string'
      ? image.content
      : (previewUrls.get(image.id) ?? '');

  return { getPreviewUrl };
};
