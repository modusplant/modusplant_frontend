'use client';

import Link from 'next/link';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Checkbox } from '@/components/_common/checkbox';
import { ShieldCheck } from 'lucide-react';

interface LoginFormRememberMeHintProps {
  rememberMeRegister: UseFormRegisterReturn;
  rememberMeValue: boolean | undefined;
  loginAttempts: number;
}

/**
 * 로그인폼 - 자동 로그인 및 힌트 영역
 * - 자동 로그인 체크박스
 * - 3회 이상 실패 시 비밀번호 재설정 안내
 */
export default function LoginFormRememberMeHint({
  rememberMeRegister,
  rememberMeValue,
  loginAttempts,
}: LoginFormRememberMeHintProps) {
  return (
    <div className="space-y-2.5">
      {/* 자동 로그인 체크박스 */}
      <Checkbox
        {...rememberMeRegister}
        id="rememberMe"
        label="아이디 저장"
        checked={rememberMeValue ?? false}
      />

      {/* 3회 실패 시 툴팁 */}
      {loginAttempts >= 3 && (
        <div
          className="bg-surface-99 flex items-center gap-2 rounded-lg p-3 text-sm"
          style={{ fontFamily: 'Pretendard' }}
        >
          <ShieldCheck size={16} className="text-primary-50" />
          <span className="text-neutral-60">
            비밀번호를 잊으셨나요?
            <Link
              href="/reset-password"
              className="text-primary-50 hover:text-primary-70 ml-1 underline"
            >
              비밀번호 재설정
            </Link>
            을 이용해보세요.
          </span>
        </div>
      )}
    </div>
  );
}
