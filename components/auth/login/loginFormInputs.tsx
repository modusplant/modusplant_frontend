'use client';

import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/_common/input';

interface LoginFormInputsProps {
  emailRegister: UseFormRegisterReturn;
  passwordRegister: UseFormRegisterReturn;
}

/**
 * 로그인폼 - 입력 필드 영역
 * - 이메일 입력 필드
 * - 비밀번호 입력 필드
 */
export default function LoginFormInputs({
  emailRegister,
  passwordRegister,
}: LoginFormInputsProps) {
  return (
    <div className="border-surface-stroke-2 overflow-hidden rounded-lg border">
      {/* 이메일 입력 필드 */}
      <Input
        {...emailRegister}
        type="email"
        placeholder="이메일을 입력해주세요"
        className="border-0 p-3 px-4.5 focus:ring-0"
      />
      {/* 구분선 */}
      <hr className="border-surface-stroke-2" />
      {/* 비밀번호 입력 필드 */}
      <Input
        {...passwordRegister}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        showPasswordToggle
        className="border-0 p-3 px-4.5 focus:ring-0"
      />
    </div>
  );
}
