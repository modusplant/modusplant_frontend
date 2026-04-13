'use client';

import { useTermsAgreement } from '@/lib/hooks/auth/useTermsAgreement';
import { Checkbox } from '@/components/_common/checkbox';
import { TERMS_MAP, TERMS_LABELS } from '@/lib/constants/terms';
import { TermsSectionProps, WithTermsFields } from '@/lib/types/auth';
import TermsItem from './termsItem';
import { FieldValues, Path, PathValue } from 'react-hook-form';

export default function TermsSection<T extends FieldValues & WithTermsFields>({
  register,
  errors,
  watch,
  setValue,
}: TermsSectionProps<T>) {
  const { contentState, toggleContent } = useTermsAgreement();

  // 현재 폼의 동의 상태 확인
  const agreementValues = {
    agreeToTerms: watch('agreeToTerms' as Path<T>),
    agreeToPrivacy: watch('agreeToPrivacy' as Path<T>),
    agreeToCommunity: watch('agreeToCommunity' as Path<T>),
  };

  // 모든 필수 약관 동의 상태
  const allTermsAgreed =
    agreementValues.agreeToTerms &&
    agreementValues.agreeToPrivacy &&
    agreementValues.agreeToCommunity;

  const handleAllAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue('agreeToTerms' as Path<T>, checked as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
    setValue('agreeToPrivacy' as Path<T>, checked as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
    setValue('agreeToCommunity' as Path<T>, checked as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-3">
      {/* 전체 동의 */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allTermsAgreed}
          onChange={handleAllAgreementChange}
          id="agreeToAll"
        />
        <label
          htmlFor="agreeToAll"
          className="text-neutral-20 cursor-pointer text-sm font-semibold"
        >
          {TERMS_LABELS.all}
        </label>
      </div>

      {/* 구분선 */}
      <div className="bg-neutral-90 h-px"></div>

      {/* 개별 약관들 */}
      <div className="space-y-3">
        {/* 이용약관 */}
        <TermsItem
          id="agreeToTerms"
          label={TERMS_LABELS.terms}
          checked={agreementValues.agreeToTerms}
          register={register('agreeToTerms' as Path<T>)}
          isExpanded={contentState.showTermsContent}
          onToggle={() => toggleContent('showTermsContent')}
          content={TERMS_MAP.terms}
        />

        {/* 개인정보 처리방침 */}
        <TermsItem
          id="agreeToPrivacy"
          label={TERMS_LABELS.privacy}
          checked={agreementValues.agreeToPrivacy}
          register={register('agreeToPrivacy' as Path<T>)}
          isExpanded={contentState.showPrivacyContent}
          onToggle={() => toggleContent('showPrivacyContent')}
          content={TERMS_MAP.privacy}
        />

        {/* 커뮤니티 운영정책 */}
        <TermsItem
          id="agreeToCommunity"
          label={TERMS_LABELS.community}
          checked={agreementValues.agreeToCommunity}
          register={register('agreeToCommunity' as Path<T>)}
          isExpanded={contentState.showCommunityContent}
          onToggle={() => toggleContent('showCommunityContent')}
          content={TERMS_MAP.community}
        />
      </div>

      {/* 에러 메시지 */}
      {(errors.agreeToTerms ||
        errors.agreeToPrivacy ||
        errors.agreeToCommunity) && (
        <p className="text-system-alert mt-2 text-sm">
          필수 약관에 동의해주세요.
        </p>
      )}
    </div>
  );
}
