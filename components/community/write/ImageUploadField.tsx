import { WriteFormData } from '@/app/community/write/[[...mode]]/page';
import { useFormContext, useWatch } from 'react-hook-form';
import ImageUploader from './imageUploader';

const ImageUploadField = () => {
  const { control, setValue } = useFormContext<WriteFormData>();

  const images = useWatch({ control, name: 'images', defaultValue: [] });
  const handleImagesChange = (newImages: (File | string)[]) => {
    setValue('images', newImages, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch border-t px-4 py-3.5">
      <ImageUploader images={images} onImagesChange={handleImagesChange} />
    </div>
  );
};

export default ImageUploadField;
