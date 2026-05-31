'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/store/authStore';
import { loginSchema, LoginFormValues } from '@/lib/constants/schema';
import { useLogin } from '@/lib/hooks/auth/useLogin';
import LoginFormInputs from './loginFormInputs';
import LoginFormError from './loginFormError';
import LoginFormRememberMeHint from './loginFormRememberMeHint';
import LoginFormActions from './loginFormActions';
import { useEffect } from 'react';
import { showModal } from '@/lib/store/modalStore';
import { SOCIAL_CONFLICT_MESSAGES } from '@/lib/constants/oauth';

interface LoginFormProps {
  className?: string;
}

export default function LoginForm({ className }: LoginFormProps) {
  const { loginAttempts } = useAuthStore();
  const { handleLogin, serverError, isLoading } = useLogin();

  useEffect(() => {
    const authError = sessionStorage.getItem('authError');
    const authCode = sessionStorage.getItem('authCode');
    if (!authError) return;

    showModal({
      type: 'snackbar',
      description: SOCIAL_CONFLICT_MESSAGES[authCode ?? ''] ?? authError,
    });
    sessionStorage.removeItem('authError');
    sessionStorage.removeItem('authCode');
  }, []);

  useEffect(() => {
    const unlinkSuccess = sessionStorage.getItem('unlinkSuccess');
    if (!unlinkSuccess) return;
    showModal({
      type: 'snackbar',
      description: '소셜 연동이 해제되었습니다.\n 다시 로그인 후 이용해주세요.',
    });
    sessionStorage.removeItem('unlinkSuccess');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(handleLogin)} className={className}>
      <div className="space-y-8">
        {/* 입력 필드 영역 */}
        <div className="space-y-2.5">
          <LoginFormInputs
            emailRegister={register('email')}
            passwordRegister={register('password')}
          />

          <LoginFormError
            emailError={errors.email}
            passwordError={errors.password}
            serverError={serverError}
          />

          <LoginFormRememberMeHint
            rememberMeRegister={register('rememberMe')}
            rememberMeValue={watch('rememberMe')}
            loginAttempts={loginAttempts}
          />
        </div>

        <LoginFormActions isLoading={isLoading} />
      </div>
    </form>
  );
}
