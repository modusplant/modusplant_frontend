'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api/client/auth';
import { Input } from '@/components/_common/input';
import Button from '@/components/_common/button';
import { cn } from '@/lib/utils/tailwindHelper';

interface ProfileFormFieldsProps {
  nickname: string;
  introduction: string;
  onNicknameChange: (value: string) => void;
  onIntroductionChange: (value: string) => void;
}

export default function ProfileFormFields({
  nickname,
  introduction,
  onNicknameChange,
  onIntroductionChange,
}: ProfileFormFieldsProps) {
  const [nicknameError, setNicknameError] = useState<string>('');
  const [nicknameSuccess, setNicknameSuccess] = useState<string>('');
  const [initialNickname] = useState(nickname); // 초기 닉네임 저장

  // 닉네임 중복 확인 핸들러
  const handleNicknameCheck = async () => {
    try {
      const result = await authApi.checkNickname(nickname);
      if (result.success && !result.available) {
        setNicknameError('이미 사용중인 닉네임입니다.');
        setNicknameSuccess('');
      } else {
        setNicknameError('');
        setNicknameSuccess('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      setNicknameError('닉네임 확인에 실패했습니다.');
      setNicknameSuccess('');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* 닉네임 필드 */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-0.5">
          <label className="text-neutral-20 text-sm leading-[1.2] font-medium tracking-[-0.01em]">
            닉네임
          </label>
          <span className="text-primary-40 text-sm font-medium">*</span>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className={`flex-1 ${nicknameError ? 'border-system-alert' : ''}`}
          />
          <Button
            onClick={handleNicknameCheck}
            variant="point"
            size="md"
            className="min-w-23 shrink-0 rounded-lg px-4 text-[15px] font-medium whitespace-nowrap"
            disabled={!nickname.trim() || nickname === initialNickname}
          >
            중복 확인
          </Button>
        </div>

        {nicknameError && (
          <p className="text-system-alert text-sm">{nicknameError}</p>
        )}
        {nicknameSuccess && (
          <p className="text-primary-50 text-sm">{nicknameSuccess}</p>
        )}
      </div>

      {/* 프로필 소개글 필드 */}
      <div className="flex flex-col gap-2">
        <label className="text-neutral-20 text-sm leading-[1.2] font-medium tracking-[-0.01em]">
          프로필 소개글
        </label>

        <textarea
          value={introduction}
          onChange={(e) => onIntroductionChange(e.target.value)}
          placeholder="한 줄 소개를 입력해주세요."
          rows={1}
          className={cn(
            'border-surface-stroke-2 min-h-30 w-full resize-none rounded-lg border',
            'min-h-30 px-4 py-4',
            'focus:border-primary-50 transition-colors focus:outline-none',
            'text-neutral-20 placeholder:text-neutral-40 text-[16px] leading-[1.2] tracking-[-0.01em]'
          )}
        />
      </div>
    </div>
  );
}
