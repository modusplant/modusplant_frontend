'use client';

import Button from '@/components/_common/button';
import NicknameSection from '../signup/nicknameSection';
import TermsSection from '../signup/termsSection';
import SocialEmailSection from './socialEmailSection';
import Textarea from '@/components/_common/textarea';
import {
  SocialSignupFormValues,
  socialSignupSchema,
} from '@/lib/constants/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useSocialAuth } from '@/lib/hooks/auth/useSocialAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SocialSignupForm() {
  const { signupData, handleSignupSubmit, isSocialAuthCompleted } =
    useSocialAuth();
  const router = useRouter();

  useEffect(() => {
    if (!signupData && !isSocialAuthCompleted.current) {
      router.replace('/login');
    }
  }, [signupData, router]); // eslint-disable-line react-hooks/exhaustive-deps
  // isSocialAuthCompleted는 useRef로 항상 동일한 참조라 deps에 포함하지 않음

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SocialSignupFormValues>({
    resolver: zodResolver(socialSignupSchema),
    mode: 'onTouched',
    defaultValues: {
      nickname: signupData?.nickname ?? '',
      introduction: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
      agreeToCommunity: false,
    },
  });

  if (!signupData) return null;

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={handleSubmit(handleSignupSubmit)}
    >
      <div className="flex flex-col gap-7.5">
        {/* 이메일 영역 */}
        <SocialEmailSection email={signupData.email} />

        {/* 닉네임 영역 */}
        <NicknameSection
          register={register}
          errors={errors}
          watch={watch}
          trigger={trigger}
        />

        {/* 프로필 소개글 */}
        <div>
          <label
            htmlFor="introduction"
            className="text-neutral-20 font-body text-sm font-medium"
          >
            프로필 소개글
          </label>
          <Textarea
            id="introduction"
            placeholder="한 줄 소개를 입력해주세요"
            {...register('introduction')}
          />
        </div>
      </div>

      {/* 이용 약관 영역 */}
      <TermsSection errors={errors} watch={watch} setValue={setValue} />

      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full rounded-lg py-3 text-[16px] font-semibold md:py-4"
        variant={!isValid || isSubmitting ? 'secondary' : 'point'}
      >
        {isSubmitting ? (
          <Image
            src={'/icon/loading.gif'}
            alt="Loading"
            width={20}
            height={20}
            unoptimized
          />
        ) : (
          '회원가입'
        )}
      </Button>
    </form>
  );
}
