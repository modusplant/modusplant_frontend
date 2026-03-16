'use client';

import { FieldError } from 'react-hook-form';

interface LoginFormErrorProps {
  emailError?: FieldError;
  passwordError?: FieldError;
  serverError?: string | null;
}

/**
 * 로그인폼 - 에러 메시지 영역
 * - 이메일/비밀번호 필드 검증 에러
 * - 서버 에러 메시지
 */
export default function LoginFormError({
  emailError,
  passwordError,
  serverError,
}: LoginFormErrorProps) {
  const errorMessage =
    emailError?.message || passwordError?.message || serverError;

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className="text-system-alert text-sm"
      style={{ fontFamily: 'Pretendard' }}
    >
      {errorMessage}
    </div>
  );
}
