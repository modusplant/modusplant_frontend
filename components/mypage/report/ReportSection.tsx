'use client';

import { Input } from '@/components/_common/input';
import { Button } from '@/components/_common/button';
import MypageBox from '../common/MypageBox';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import PreviewImage from '../common/previewImage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBugReportMutation } from '@/lib/hooks/mypage/useBugReportMutation';
import { useBlockNavigation } from '@/lib/hooks/common/useBlockNavigation';
import FixedBottomButton from '@/components/_common/fixedBottomButton';

const reportFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  image: z.file().nullable(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

const ReportSection = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: '',
      content: '',
      image: null,
    },
  });

  const { mutate } = useBugReportMutation({ onSuccess: reset });

  useBlockNavigation(isDirty);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue('image', file);
    }
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setValue('image', null);
  };

  const onSubmit = (data: ReportFormValues) => {
    mutate(data);
  };

  return (
    <MypageBox className="lg:border-surface-98 border-none p-0 lg:border lg:px-10 lg:py-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-6">
          <h1 className="typo-bold20 text-neutral-5 sr-only leading-[1.2] md:not-sr-only">
            건의/버그 제보
          </h1>

          <div className="bg-surface-99 rounded-lg px-[18px] py-[14px]">
            <p className="text-neutral-30 text-[14px] break-keep">
              서비스 개선을 위한 소중한 의견을 보내주세요.
              <br className="sm:hidden" /> 제출하신 내용은 운영진이 검토 후
              등록하신 이메일로 답변을 보내드립니다.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="typo-medium text-neutral-20">제목</p>
            <Input
              {...register('title')}
              maxLength={60}
              showCount
              placeholder="제목을 입력해주세요."
              className="text-neutral-40 typo-regular14"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="typo-medium text-neutral-40">내용</p>
            <textarea
              {...register('content')}
              className="border-surface-stroke-2 text-neutral-40 typo-regular14 placeholder:text-neutral-70 focus:border-primary-50 h-[180px] w-full resize-none rounded-[10px] border bg-transparent p-4 break-keep transition-colors outline-none"
              placeholder="자세한 내용을 입력해주세요. 버그 제보의 경우 발생 상황과 재현 방법을 구체적으로 설명해주시면 더욱 도움이 됩니다."
            />
          </div>

          <div className="flex w-full flex-col-reverse md:flex-col md:items-start md:gap-[25px]">
            {previewUrl && (
              <>
                <hr className="border-surface-stroke hidden w-full md:block" />
                <div className="-mr-5 overflow-x-auto scroll-smooth pt-8 md:mr-0 md:overflow-visible md:pt-0">
                  <div className="flex snap-x snap-mandatory gap-[15px] pr-5 md:gap-3 md:pr-0">
                    {/* 여러개 보여줄때는 PreviewImage 컴포넌트 추가 */}
                    <PreviewImage
                      className="border-surface-stroke-2 snap-start rounded-[7px] border"
                      previewUrl={previewUrl}
                      onRemove={handleRemoveImage}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex w-full items-center justify-between">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="image-upload"
                  className="border-primary-40 text-primary-50 hover:bg-primary-10 inline-flex cursor-pointer items-center justify-center gap-[6px] rounded-full border px-[18px] py-3 transition-colors"
                >
                  <Upload size={14} />
                  <span className="typo-medium">사진 첨부</span>
                </label>
              </div>

              <FixedBottomButton className="bg-surface-98 w-full md:w-auto md:pb-0">
                <div className="border-surface-98 flex border-t md:flex-col md:items-end">
                  <Button
                    type="submit"
                    variant="point"
                    className="w-full rounded-lg py-3 text-[16px] font-semibold md:w-auto md:rounded-full"
                  >
                    <span className="md:typo-medium">제출하기</span>
                  </Button>
                </div>
              </FixedBottomButton>
            </div>
          </div>
        </div>
      </form>
    </MypageBox>
  );
};

export default ReportSection;
