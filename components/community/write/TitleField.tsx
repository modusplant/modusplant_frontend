import {
  MAX_TITLE_LENGTH,
  WriteFormData,
} from '@/app/community/write/[[...mode]]/page';
import { useFormContext, useWatch } from 'react-hook-form';

const TitleField = () => {
  const { control, register } = useFormContext<WriteFormData>();
  const title = useWatch({ control, name: 'title', defaultValue: '' });

  return (
    <div className="border-surface-stroke flex items-center justify-between gap-2 self-stretch rounded-[10px] border px-3 py-3 md:px-4.5 md:py-4.5">
      <input
        {...register('title')}
        type="text"
        className="text-neutral-20 placeholder:text-neutral-60 flex-1 text-lg leading-normal font-normal tracking-[-0.01em] focus:outline-none"
        placeholder="제목을 입력해주세요."
      />
      <span className="text-[15px] leading-[1.4] font-normal tracking-[-0.04em] text-[#A9A9A9]">
        {title.length} / {MAX_TITLE_LENGTH}
      </span>
    </div>
  );
};

export default TitleField;
