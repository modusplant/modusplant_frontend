import Button from '@/components/_common/button';
import { Checkbox } from '@/components/_common/checkbox';
import Dropdown from '@/components/_common/dropdown';
import Textarea from '@/components/_common/textarea';
import { useSignout } from '@/lib/hooks/auth/useSignout';
import { useDropdownState } from '@/lib/hooks/category/useDropdownState';
import type { SignoutRequestBody } from '@/lib/types/auth';
import { cn } from '@/lib/utils/tailwindHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Triangle } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const signoutSchema = z.object({
  reason: z
    .enum([
      'CONTENT_OR_INFO_NOT_SATISFY',
      'NOT_MATCHED_COMMUNITY_MOOD',
      'NOT_NEED_THIS',
      'UNCOMFORTABLE_TO_USE',
      'OTHERS',
    ])
    .optional()
    .refine((val) => val !== undefined),
  opinion: z.string().optional(),
  agreeCheck: z.boolean().refine((val) => val === true),
});

export type SignoutFormValues = z.infer<typeof signoutSchema>;

type SignoutReasonOptionsType = {
  label: string;
  value: SignoutRequestBody['reason'];
}[];

const SIGNOUT_REASON_OPTIONS: SignoutReasonOptionsType = [
  {
    label: '사용하기 불편해서 (원하는 기능 부족, UI/UX 불편, 오류 등 포함)',
    value: 'UNCOMFORTABLE_TO_USE',
  },
  {
    label: '필요가 없어져서 (사용 목적 변화, 더 이상 안 쓰게 됨)',
    value: 'NOT_NEED_THIS',
  },
  {
    label: '콘텐츠/정보가 만족스럽지 않아서 (정보 부족, 업데이트 느림 등)',
    value: 'CONTENT_OR_INFO_NOT_SATISFY',
  },
  {
    label: '커뮤니티 분위기가 맞지 않아서 (부적절한 사용자, 불편한 경험 등)',
    value: 'NOT_MATCHED_COMMUNITY_MOOD',
  },
  {
    label: '기타 (직접 입력)',
    value: 'OTHERS',
  },
];

interface SignoutFormProps extends HTMLAttributes<HTMLDivElement> {
  savedFormValues?: SignoutFormValues;
  handleSignout: (formValues: SignoutFormValues) => void;
}

export const SignoutForm = ({
  savedFormValues,
  handleSignout,
  className,
}: SignoutFormProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<SignoutFormValues>({
    resolver: zodResolver(signoutSchema),
    mode: 'onChange',
    defaultValues: {
      reason: savedFormValues?.reason,
      opinion: savedFormValues?.opinion,
      agreeCheck: savedFormValues?.agreeCheck,
    },
  });

  const { close, isOpen, toggle } = useDropdownState();

  const { isLoading } = useSignout();

  const handleSelectOption = (value: SignoutRequestBody['reason']) => {
    setValue('reason', value);
  };

  return (
    <div className={cn(className)}>
      <form
        onSubmit={handleSubmit(handleSignout)}
        className="text-neutral-20 flex flex-col gap-7.5"
      >
        <div className="flex flex-col items-center justify-center">
          <p className="typo-bold20 pb-6.5 text-[24px]">회원탈퇴</p>
          <p className="typo-regular14 text-neutral-20 text-[16px]">
            탈퇴 하기 전 아래 내용을 확인해주세요
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="typo-medium text-[15px]">
            탈퇴 사유{' '}
            <sup className="text-primary-50 inline-block -translate-x-0.5">
              *
            </sup>
          </label>
          <Dropdown
            isOpen={isOpen}
            trigger={
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  toggle();
                }}
                fullWidth
                className="justify-between rounded-lg px-4.5 py-3.5"
              >
                <p>
                  {SIGNOUT_REASON_OPTIONS.find(
                    ({ value }) => watch('reason') === value
                  )?.label ?? '탈퇴 사유를 선택해주세요'}
                </p>
                <Triangle
                  fill="#ADADAD"
                  stroke="none"
                  className="h-2 scale-x-125 rotate-180"
                />
              </Button>
            }
            onClose={close}
            items={SIGNOUT_REASON_OPTIONS.map((prop) => ({
              ...prop,
              onClick: () => handleSelectOption(prop.value),
              className: '',
            }))}
            width="w-full"
          />
        </div>
        <div>
          <label className="typo-medium inline-block pb-2 text-[15px] leading-5">
            더 나은 서비스를 위해 소중한 의견을 들려주세요.
          </label>
          <Textarea
            placeholder="서비스 이용 중 불편하셨던 점이나 개선할 점을 자유롭게 적어주세요."
            {...register('opinion')}
          />
        </div>
        <div className="flex flex-col gap-6.5">
          <ul className="bg-surface-99 typo-regular14 text-neutral-20 list-disc rounded-lg p-4 pl-10 text-[16px] leading-8">
            <li>탈퇴시 개인정보에 해당하는 정보가 모두 삭제됩니다.</li>
            <li>탈퇴 후에도 작성한 게시글, 댓글, 대댓글 정보는 유지됩니다.</li>
            <li>탈퇴 후 동일한 이메일 정보를 사용하여 재가입할 수 있습니다.</li>
          </ul>
          <div className="flex items-center justify-center gap-1 text-center">
            <Checkbox
              {...register('agreeCheck')}
              id="agreeCheck"
              checked={watch('agreeCheck') ?? false}
            />
            <label className="typo-semibold14 text-[15px]">
              안내사항을 모두 확인하였으며, 이에 동의합니다.
            </label>
          </div>
          <div>
            <Button
              variant="point"
              disabled={!isValid || !watch('reason') || isLoading}
              fullWidth
              className="bg-system-alert disabled:bg-neutral-80 hover:bg-#D32F2F typo-semibold14 h-13 rounded-lg text-[16px]"
              type="submit"
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
