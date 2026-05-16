'use client';
import { cn } from '@/lib/utils/tailwindHelper';
import { useEmailVerification } from '@/lib/hooks/auth/useEmailVerification';
import { Input } from '@/components/_common/input';
import Button from '@/components/_common/button';
import { EmailSectionProps } from '@/lib/types/auth';
import Image from 'next/image';

export default function EmailSection({
  register,
  trigger,
  watch,
  errors,
  onEmailVerified,
  className,
}: EmailSectionProps) {
  const watchedEmail = watch('email');

  const {
    isCodeSent,
    isVerified,
    canResend,
    timeRemaining,
    formattedTime,
    handleRequestVerification,
    handleResendVerification,
    handleVerifyCode,
    isVerifyLoading,
    isRequestLoading,
  } = useEmailVerification({ trigger, watch });

  const handleVerify = async () => {
    const result = await handleVerifyCode(watchedEmail);
    if (result?.success) onEmailVerified(true);
  };

  const handleResend = async () => {
    onEmailVerified(false);
    await handleResendVerification(watchedEmail);
  };

  const emailDisabled =
    !watchedEmail || !!errors.email || (isCodeSent && !canResend) || isVerified;

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-neutral-20 block text-sm font-medium">
        이메일
      </label>

      {/* 이메일 입력 + 인증요청 버튼 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            {...register('email')}
            type="email"
            placeholder="이메일을 입력해주세요"
            disabled={isVerified}
            className={cn(
              'w-full',
              errors.email && 'border-system-alert',
              isVerified && 'border-primary-50'
            )}
          />
        </div>
        <Button
          type="button"
          onClick={() =>
            canResend ? handleResend() : handleRequestVerification(watchedEmail)
          }
          disabled={emailDisabled || isRequestLoading}
          className="w-full min-w-23 cursor-pointer rounded-lg px-5 py-3 text-sm font-medium sm:w-auto"
          variant={!emailDisabled ? 'point' : 'secondary'}
        >
          {isRequestLoading ? (
            <Image
              src={'/icon/loading.gif'}
              alt="Loading"
              width={20}
              height={20}
              unoptimized
            />
          ) : canResend ? (
            '재요청'
          ) : (
            '인증요청'
          )}
        </Button>
      </div>

      {/* 이메일 에러 메시지 */}
      {errors.email && (
        <p className="text-system-alert text-sm font-medium">
          {errors.email.message}
        </p>
      )}

      {/* 인증코드 입력 */}
      {isCodeSent && !isVerified && (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                {...register('verificationCode')}
                type="text"
                placeholder="인증코드를 입력해주세요"
                className="w-full font-medium"
              />
            </div>
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!watch('verificationCode') || isVerifyLoading}
              className="w-full min-w-23 rounded-lg px-5 py-3 text-sm font-medium sm:w-auto"
              variant={watch('verificationCode') ? 'point' : 'secondary'}
            >
              {isVerifyLoading ? (
                <Image
                  src={'/icon/loading.gif'}
                  alt="Loading"
                  width={20}
                  height={20}
                  unoptimized
                />
              ) : (
                '확인'
              )}
            </Button>
          </div>

          {/* 카운트다운 */}
          {timeRemaining > 0 && (
            <p className="text-neutral-60 text-sm font-medium">
              요청 시간 {formattedTime}
            </p>
          )}

          {/* 인증코드 에러 메시지 */}
          {errors.verificationCode && (
            <p className="text-system-alert text-sm font-medium">
              {errors.verificationCode.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
