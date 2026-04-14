'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import { useNicknameVerification } from '@/lib/hooks/auth/useNicknameVerification';
import { Input } from '@/components/_common/input';
import Button from '@/components/_common/button';
import { NicknameSectionProps, WithNicknameField } from '@/lib/types/auth';
import Image from 'next/image';
import { FieldValues, Path } from 'react-hook-form';

export default function NicknameSection<
  T extends FieldValues & WithNicknameField,
>({ register, trigger, watch, errors, className }: NicknameSectionProps<T>) {
  const watchedNickname = watch('nickname' as Path<T>);

  const {
    isChecked,
    isAvailable,
    message,
    isLoading,
    checkNickname,
    resetVerification,
  } = useNicknameVerification();

  const nicknameDisabled = !watchedNickname || !!errors.nickname || isLoading;

  // 닉네임 중복 확인 핸들러
  const handleCheckNickname = async () => {
    const nicknameValid = await trigger('nickname' as Path<T>);
    if (!nicknameValid) return;

    await checkNickname(watchedNickname);
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register('nickname' as Path<T>).onChange(e);
    // 닉네임 변경 시 검증 상태 초기화
    resetVerification();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-neutral-20 block text-sm font-medium">
        닉네임
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            {...register('nickname' as Path<T>)}
            type="text"
            placeholder="닉네임을 입력해주세요"
            className={cn(
              'w-full',
              errors.nickname && 'border-system-alert',
              isChecked && !isAvailable && 'border-system-alert'
            )}
            onChange={handleNicknameChange}
          />
        </div>
        <Button
          type="button"
          onClick={handleCheckNickname}
          disabled={nicknameDisabled}
          className="min-w-23 cursor-pointer rounded-lg px-5 py-3 text-sm sm:w-auto"
          variant={nicknameDisabled && !isLoading ? 'secondary' : 'point'}
        >
          {isLoading ? (
            <Image
              src={'/icon/loading.gif'}
              alt="Loading"
              width={20}
              height={20}
              unoptimized
            />
          ) : (
            '중복확인'
          )}
        </Button>
      </div>

      {/* 닉네임 에러 메시지 */}
      {errors.nickname && (
        <p className="text-system-alert text-sm">{errors.nickname.message}</p>
      )}
      {isChecked && !isAvailable && (
        <p className="text-system-alert text-sm">{message}</p>
      )}
      {isChecked && isAvailable && (
        <p className="text-primary-50 text-sm">{message}</p>
      )}
    </div>
  );
}
