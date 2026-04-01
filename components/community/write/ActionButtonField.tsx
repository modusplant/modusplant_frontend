import { WriteFormData } from '@/lib/schemas/writeForm';
import { useFormContext, useFormState } from 'react-hook-form';

interface ActionButtonFieldProps {
  isEditMode: boolean;
}

const ActionButtonField = ({ isEditMode }: ActionButtonFieldProps) => {
  const { control } = useFormContext<WriteFormData>();
  const { isSubmitting, isValid } = useFormState({ control });

  return (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="submit"
        className={`flex h-10 items-center gap-25 rounded-[7px] px-5 py-3.5 text-[15px] leading-[1.2] font-medium tracking-[-0.01em] text-white transition-colors ${isValid && !isSubmitting ? 'bg-primary-50 hover:bg-primary-70' : 'bg-neutral-90 cursor-not-allowed'}`}
      >
        {isSubmitting
          ? isEditMode
            ? '수정 중...'
            : '등록 중...'
          : isEditMode
            ? '수정하기'
            : '등록하기'}
      </button>
    </div>
  );
};

export default ActionButtonField;
