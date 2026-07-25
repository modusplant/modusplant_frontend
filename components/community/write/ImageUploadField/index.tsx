import { useFormContext, useWatch } from 'react-hook-form';

import { cn } from '@/lib/utils/tailwindHelper';
import { WriteFormData, WriteImageData } from '@/lib/schemas/writeForm';

import ImageDropZone from './ImageDropZone';
import ImageUploadButton from './ImageUploadButton';
import { showModal } from '@/lib/store/modalStore';
import {
  ERROR_MSGS,
  ALLOWED_MIME_TYPES,
  MAXIMUM_FILE_COUNT,
  MAXIMUM_FILE_SIZE,
  buildImageApiFilename,
} from '@/lib/constants/write';
import { useDnD } from '@/lib/hooks/community/useDnD';
import ImageItem from './ImageItem';
import { useEffect, useRef, useState } from 'react';
import ImagePopup from './ImagePopup';
import { createUuid } from '@/lib/utils/uuid';
import { uploadImageFile } from '@/lib/api/client/upload';

const ImageUploadField = () => {
  const { control, setValue, getValues } = useFormContext<WriteFormData>();
  const images = useWatch({ control, name: 'images' });

  const [popupImageId, setPopupImageId] = useState<string | null>(null);
  // 이미지 id별 진행 중인 업로드의 AbortController (삭제 시 취소용)
  const uploadControllersRef = useRef(new Map<string, AbortController>());

  const handleImages = (values: WriteImageData[]) =>
    setValue('images', values, { shouldDirty: true, shouldValidate: true });

  const showErrorModal = (msg: string) => {
    showModal({ type: 'snackbar', description: msg });
    return false;
  };

  const removeImage = (id: string) => {
    uploadControllersRef.current.get(id)?.abort();
    uploadControllersRef.current.delete(id);

    const newImages = images.filter((item) => item.id !== id);
    const hasThumbnail = newImages.some(({ isThumbnail }) => isThumbnail);
    if (newImages.length > 0 && !hasThumbnail) newImages[0].isThumbnail = true;

    handleImages(newImages);
  };

  // 개별 이미지 상태만 업데이트 (id로 특정)
  const patchImage = (id: string, patch: Partial<WriteImageData>) => {
    setValue(
      'images',
      // useWatch로 받은 images는 stale일 수 있어 form 내부 최신 값을 함수형으로 갱신
      getValues('images').map((img) =>
        img.id === id ? { ...img, ...patch } : img
      ),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  // 발급 + S3 PUT을 수행하고 결과를 해당 이미지에 반영 (최초 업로드/재시도 공용)
  const startUpload = (id: string, file: File, filename: string) => {
    const controller = new AbortController();
    uploadControllersRef.current.set(id, controller);

    patchImage(id, { status: 'uploading' });
    uploadImageFile(file, filename, controller.signal)
      .then(({ fileKey }) => patchImage(id, { fileKey, status: 'done' }))
      .catch(() => {
        // 사용자가 이미 이미지를 삭제해서 취소된 업로드는 조용히 무시
        if (controller.signal.aborted) return;
        patchImage(id, { status: 'error' });
        showErrorModal(ERROR_MSGS['UPLOAD_FAILED']);
      })
      .finally(() => {
        uploadControllersRef.current.delete(id);
      });
  };

  // 업로드 실패한 이미지 재시도. 기존 게시글에서 불러온 이미지(파일 바이트가 없음)는
  // 재업로드가 불가능하므로 삭제 후 재등록을 안내한다.
  const retryUpload = (id: string) => {
    const target = getValues('images').find((image) => image.id === id);
    if (!target) return;

    if (!(target.content instanceof File) || !target.filename) {
      showErrorModal(ERROR_MSGS['LEGACY_IMAGE_UNSUPPORTED']);
      return;
    }

    startUpload(target.id, target.content, target.filename);
  };

  const uploadFiles = (files: FileList) => {
    const validatedFiles = Array.from(files).filter((file) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type))
        return showErrorModal(ERROR_MSGS['INVALID_TYPE']);

      if (file.size > MAXIMUM_FILE_SIZE)
        return showErrorModal(ERROR_MSGS['MAX_SIZE']);

      return true;
    });

    const currentImages = getValues('images');
    const nextCount = currentImages.length + validatedFiles.length;
    if (nextCount > MAXIMUM_FILE_COUNT) {
      showErrorModal(ERROR_MSGS['MAX_COUNT']);
      return;
    }

    const newImages: WriteImageData[] = validatedFiles.map((file, i) => {
      const id = createUuid();
      const filename = buildImageApiFilename(currentImages.length + i, file);
      return {
        id,
        content: file,
        isThumbnail: false,
        status: 'uploading',
        filename,
      };
    });

    const nextImages = [...currentImages, ...newImages];
    if (currentImages.length === 0 && nextImages.length > 0) {
      nextImages[0].isThumbnail = true;
    }
    handleImages(nextImages);

    // 파일별로 즉시 업로드 시작 (선택 즉시 업로드 방식)
    newImages.forEach((img) => {
      startUpload(img.id, img.content as File, img.filename!);
    });
  };

  const { isDragging, handleDragLeave, handleDrop, handleDragOver } = useDnD({
    onDropFiles: uploadFiles,
  });

  // keyboard event handlers for image popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!popupImageId) return;

      // close popup on Escape key
      if (e.key === 'Escape') setPopupImageId(null);

      // navigate images with Arrow keys
      const currentIndex = images.findIndex(({ id }) => id === popupImageId);
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % images.length;
        setPopupImageId(images[nextIndex].id);
      }
      if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setPopupImageId(images[prevIndex].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [popupImageId, images]);

  const popupImage = images.find((image) => image.id === popupImageId);
  return (
    <>
      <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch border-t px-4 py-3.5">
        <div className="w-full">
          <ImageUploadButton handleChange={uploadFiles} />
          {images.length > 0 ? (
            <div
              className={cn(
                'mt-4 overflow-x-auto rounded-lg pb-2',
                isDragging
                  ? 'border-primary-50 bg-primary-10'
                  : 'border-surface-stroke'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex min-w-min gap-3 px-2 py-2">
                {images.map((image) => (
                  <ImageItem
                    key={image.id}
                    image={image}
                    handleClickImage={() => setPopupImageId(image.id)}
                    handleDelete={removeImage}
                    handleRetry={retryUpload}
                  />
                ))}
              </div>
            </div>
          ) : (
            <ImageDropZone
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          )}
        </div>
      </div>
      {popupImage && (
        <ImagePopup
          handleClose={() => setPopupImageId(null)}
          image={popupImage}
          handleThumbnailImage={(id) => {
            const newImages = images
              .map((item) => ({ ...item, isThumbnail: false }))
              .map((item) => {
                if (item.id !== id) return item;
                item.isThumbnail = true;
                return item;
              });

            handleImages(newImages);
          }}
        />
      )}
    </>
  );
};

export default ImageUploadField;
