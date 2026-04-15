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
import { useRouter } from 'next/navigation';
import { useOAuthStore } from '@/lib/store/oauthStore';
import { useEffect } from 'react';
import { OauthApi } from '@/lib/api/client/oauth';
import { TERMS_VERSIONS } from '@/lib/constants/terms';
import { processSuccessfulAuth } from '@/lib/utils/auth/processSuccessfulAuth';
import { useAuthStore } from '@/lib/store/authStore';

export default function SocialSignupForm() {
  const router = useRouter();
  const { signupData, clearSignupData } = useOAuthStore();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (!signupData) {
      router.replace('/login');
    }
  }, [signupData, router]);

  if (!signupData) return null;

  const onSubmit = async (data: SocialSignupFormValues) => {
    try {
      if (signupData.type === 'NEED_SIGNUP') {
        const result = await OauthApi.kakaoSignup({
          nickname: data.nickname,
          introduction: data.introduction || undefined,
          agreedTermsOfUseVersion: TERMS_VERSIONS.termsOfUse,
          agreedPrivacyPolicyVersion: TERMS_VERSIONS.privacyPolicy,
          agreedCommunityPolicyVersion: TERMS_VERSIONS.adInfoReceiving,
        });

        if (result.status === 200 && result.data?.accessToken) {
          const user = await processSuccessfulAuth(
            result.data.accessToken,
            true
          );
          login(user);
          clearSignupData();
          router.replace('/');
        }
      }
    } catch (error) {
      console.error('소셜 회원가입 실패', error);
    }
  };

  const formData = watch();
  const isFormValid =
    !Object.keys(errors).length &&
    !!formData.nickname &&
    formData.agreeToTerms &&
    formData.agreeToPrivacy &&
    formData.agreeToCommunity;

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
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
      <TermsSection
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full rounded-lg py-3 text-[16px] font-semibold md:py-4"
        variant={!isFormValid || isSubmitting ? 'secondary' : 'point'}
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
