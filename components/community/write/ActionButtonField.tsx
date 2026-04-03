import { WriteFormData } from '@/lib/schemas/writeForm';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import WriteButton from './_common/WriteButton';

interface ActionButtonFieldProps {
  isEditMode: boolean;
  draftCount: number;
  onClickLoadDraft: () => void;
  onClickSaveDraft: () => void;
}

const ActionButtonField = ({
  isEditMode,
  draftCount,
  onClickLoadDraft,
  onClickSaveDraft,
}: ActionButtonFieldProps) => {
  const { control } = useFormContext<WriteFormData>();
  const { isSubmitting, isValid } = useFormState({ control });

  const [title, textContent, images] = useWatch({
    control,
    name: ['title', 'textContent', 'images'],
  });

  return (
    <div className="flex items-center justify-between gap-2.5">
      {!isEditMode ? (
        <div className="flex items-center gap-2.5">
          <WriteButton
            type="button"
            variant="default"
            className="flex-inline gap-2.5"
            onClick={onClickLoadDraft}
          >
            <span>불러오기</span>
            <span className="text-surface-stroke">|</span>
            <span className="text-primary-50">{draftCount}</span>
          </WriteButton>
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-2.5">
        {!isEditMode && (
          <WriteButton
            type="button"
            variant="default"
            onClick={onClickSaveDraft}
            disabled={!title && !textContent && images.length === 0}
          >
            임시저장
          </WriteButton>
        )}
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
