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
} from '@/lib/constants/write';
import { useDnD } from '@/lib/hooks/community/useDnD';
import ImageItem from './ImageItem';
import { useState } from 'react';
import ImagePopup from './ImagePopup';

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ImageUploadField = () => {
  const { control, setValue } = useFormContext<WriteFormData>();
  const images = useWatch({ control, name: 'images' });

  const [popupImageId, setPopupImageId] = useState<string | null>(null);

  const handleImages = (values: WriteImageData[]) =>
    setValue('images', values, { shouldDirty: true, shouldValidate: true });

  const removeImage = (id: string) => {
    const newImages = images.filter((item) => item.id !== id);
    const hasThumbnail = newImages.some(({ isThumbnail }) => isThumbnail);
    if (newImages.length > 0 && !hasThumbnail) newImages[0].isThumbnail = true;

    handleImages(newImages);
  };

  const uploadFiles = (files: FileList) => {
    const validatedFiles = Array.from(files).filter((file) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type))
        return showErrorModal(ERROR_MSGS['INVALID_TYPE']);

      if (file.size > MAXIMUM_FILE_SIZE)
        return showErrorModal(ERROR_MSGS['MAX_SIZE']);

      return true;
    });

    const newImages = validatedFiles.map((content) => {
      const id = createId();
      return { id, content, isThumbnail: false };
    });

    const nextImages = [...images, ...newImages];
    if (nextImages.length > MAXIMUM_FILE_COUNT) {
      showErrorModal(ERROR_MSGS['MAX_COUNT']);
      return;
    }

    if (images.length == 0) nextImages[0].isThumbnail = true;
    handleImages(nextImages);
  };

  const { isDragging, handleDragLeave, handleDrop, handleDragOver } = useDnD({
    onDropFiles: uploadFiles,
  });

  const showErrorModal = (msg: string) => {
    showModal({ type: 'snackbar', description: msg });
    return false;
  };

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
