import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { cn } from '@/lib/utils/tailwindHelper';
import { WriteFormData } from '@/lib/schemas/writeForm';

import ImagePreviewItem from './ImagePreviewItem';
import ImageDropZone from './ImageDropZone';
import ImageUploadButton from './ImageUploadButton';
import { showModal } from '@/lib/store/modalStore';
import {
  ERROR_MSGS,
  ALLOWED_MIME_TYPES,
  MAXIMUM_FILE_COUNT,
  MAXIMUM_FILE_SIZE,
} from '@/lib/constants/write';
import { PreviewImage } from '@/lib/types/write';
import { useDnD } from '@/lib/hooks/community/useDnD';

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ImageUploadField = () => {
  const ref = useRef<HTMLInputElement>(null);

  const { control, setValue } = useFormContext<WriteFormData>();

  const images = useWatch({ control, name: 'images', defaultValue: [] });
  const [previewList, setPreviewList] = useState<PreviewImage[]>(() =>
    images.map((file) => ({ id: createId(), file }))
  );

  useEffect(() => {
    // TODO: https://react.dev/learn/you-might-not-need-an-effect
    // eslint-disable-next-line
    setPreviewList((prev) => {
      return images.map(
        (file, index) => prev[index] ?? { id: createId(), file }
      );
    });
  }, [images]);

  const handleImages = (newPreviewList: PreviewImage[]) => {
    setPreviewList(newPreviewList);

    const value = newPreviewList.map(({ file }) => file);
    setValue('images', value, { shouldDirty: true, shouldValidate: true });
  };

  const uploadFiles = (fileList: File[]) => {
    if (previewList.length + fileList.length > MAXIMUM_FILE_COUNT) {
      showModal({
        type: 'snackbar',
        description: ERROR_MSGS['MAX_COUNT'],
      });
      return;
    }

    const newPreviewList = fileList.map((file) => ({ id: createId(), file }));
    handleImages([...previewList, ...newPreviewList]);
  };

  const validateFiles = (files: File[]) => {
    return files.filter((file) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        showModal({
          type: 'snackbar',
          description: ERROR_MSGS['INVALID_TYPE'],
        });
        return false;
      }

      if (file.size > MAXIMUM_FILE_SIZE) {
        showModal({ type: 'snackbar', description: ERROR_MSGS['MAX_SIZE'] });
        return false;
      }

      return true;
    });
  };

  const { isDragging, handleDragLeave, handleDrop, handleDragOver } = useDnD({
    onDropFiles: (files) => {
      const newFiles = validateFiles(Array.from(files));
      uploadFiles(newFiles);
    },
  });

  const removeImage = (id: string) => {
    handleImages(previewList.filter((item) => item.id !== id));
  };

  return (
    <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch border-t px-4 py-3.5">
      <div className="w-full">
        <ImageUploadButton
          ref={ref}
          handleChange={(e) => {
            const files = e.target.files;
            if (files) {
              const newFiles = validateFiles(Array.from(files));
              uploadFiles(newFiles);
            }

            if (ref.current) ref.current.value = '';
          }}
        />
        {previewList.length > 0 ? (
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
              {previewList.map((preview) => (
                <ImagePreviewItem
                  key={preview.id}
                  preview={preview}
                  onRemove={removeImage}
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
  );
};

export default ImageUploadField;
