'use client';

import { Input } from '@/components/_common/input';
import { Button } from '@/components/_common/button';
import MypageBox from '../common/MypageBox';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import PreviewImage from '../common/previewImage';
import { useForm } from 'react-hook-form';

const ReportSection = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  // TODO: react-hook-form 연동
  const { register, handleSubmit } = useForm();

  return (
    <MypageBox className="px-10 py-12">
      <form action="">
        <div className="flex w-full flex-col gap-6">
          <h1 className="text-bold-20 text-neutral-5 leading-[1.2]">
            건의/버그제보
          </h1>

          <div className="bg-surface-99 rounded-lg px-[18px] py-[14px]">
            <p className="text-neutral-30 text-[14px]">
              서비스 개선을 위한 소중한 의견을 보내주세요. 제출하신 내용은
              운영진이 검토 후 등록하신 이메일로 답변을 보내드립니다.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-medium14 text-neutral-20">제목</p>
            <Input
              maxLength={60}
              showCount
              placeholder="건의사항이나 버그에 대해 간단한 제목을 입력해주세요."
              className="placeholder:text-neutral-70 text-neutral-40 text-regular14"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-medium14 placeholder:text-neutral-20 text-neutral-40">
              내용
            </p>
            <textarea
              className="border-surface-stroke-2 text-neutral-40 text-regular14 placeholder:text-neutral-70 placeholder:text-regular14 focus:border-primary-50 h-[180px] w-full resize-none rounded-[10px] border bg-transparent p-4 transition-colors outline-none"
              placeholder="자세한 내용을 입력해주세요. 버그 제보의 경우 발생 상황과 재현 방법을 구체적으로 설명해주시면 더욱 도움이 됩니다."
            />
          </div>

          {previewUrl && (
            <div className="flex flex-col gap-5">
              <hr className="border-surface-stroke w-full" />
              <PreviewImage
                className="border-surface-stroke-2 rounded-[7px] border"
                previewUrl={previewUrl}
                onRemove={handleRemoveImage}
              />
            </div>
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
                <span className="text-medium14">사진 첨부</span>
              </label>
            </div>
            <Button variant="point" className="cursor-pointer px-[18px] py-3">
              <span className="text-medium14">제출하기</span>
            </Button>
          </div>
        </div>
      </form>
    </MypageBox>
  );
};

export default ReportSection;
