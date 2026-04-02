import { WriteFormData } from '@/lib/schemas/writeForm';
import { useFormContext } from 'react-hook-form';

const ContentField = () => {
  const { register } = useFormContext<WriteFormData>();

  return (
    <div className="flex flex-1 flex-col gap-2.5 self-stretch p-5">
      <textarea
        {...register('textContent')}
        placeholder="내용을 입력해주세요."
        className="text-neutral-20 placeholder:text-neutral-60 h-full min-h-75 resize-none text-base leading-[1.8] font-normal tracking-[-0.01em] focus:outline-none"
      />
    </div>
  );
};

export default ContentField;
