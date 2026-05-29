import { useFormContext, useWatch } from 'react-hook-form';

import { MAX_TITLE_LENGTH } from '@/lib/constants/write';
import type { WriteFormData } from '@/lib/schemas/writeForm';

const TitleField = () => {
  const { control, register } = useFormContext<WriteFormData>();
  const title = useWatch({ control, name: 'title', defaultValue: '' });

  return (
    <div className="border-border-subtle flex items-center justify-between gap-2 self-stretch rounded-[10px] border px-4.5 py-3 md:px-4.5 md:py-4.5">
      <input
        {...register('title')}
        type="text"
        className="text-text-subtle placeholder:text-text-muted flex-1 text-lg leading-normal font-normal tracking-[-0.01em] focus:outline-none"
        placeholder="제목을 입력해주세요."
      />
      <span className="text-text-placeholder text-[15px] leading-[1.4] font-normal tracking-[-0.04em]">
        {title.length} / {MAX_TITLE_LENGTH}
      </span>
    </div>
  );
};

export default TitleField;
