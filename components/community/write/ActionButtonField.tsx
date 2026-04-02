import { WriteFormData } from '@/lib/schemas/writeForm';
import { useFormContext, useFormState } from 'react-hook-form';
import WriteButton from './_common/WriteButton';

interface ActionButtonFieldProps {
  isEditMode: boolean;
}

const ActionButtonField = ({ isEditMode }: ActionButtonFieldProps) => {
  const { control } = useFormContext<WriteFormData>();
  const { isSubmitting, isValid } = useFormState({ control });

  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5">
        <WriteButton
          variant="default"
          className="flex-inline gap-2.5"
          onClick={(e) => e.preventDefault()}
        >
          <span>불러오기</span>
          <span className="text-surface-stroke">|</span>
          <span className="text-primary-50">{0}</span>
        </WriteButton>
      </div>
      <div className="flex items-center gap-2.5">
        <WriteButton variant="default" onClick={(e) => e.preventDefault()}>
          임시저장
        </WriteButton>
        <WriteButton type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? '수정 중...'
              : '등록 중...'
            : isEditMode
              ? '수정하기'
              : '등록하기'}
        </WriteButton>
      </div>
    </div>
  );
};

export default ActionButtonField;
