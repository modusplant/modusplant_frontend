'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmailVerificationState } from '@/lib/types/auth';
import { authApi } from '@/lib/api/client/auth';
import { showModal } from '@/lib/store/modalStore';
import { useRouter } from 'next/navigation';

const DEFAULT_EXPIRES_IN = 300; // 5분 = 300초

interface UseEmailVerificationProps {
  trigger?: (field: any) => Promise<boolean>;
  watch?: (field: any) => any;
}

export const useEmailVerification = ({
  trigger,
  watch,
}: UseEmailVerificationProps = {}) => {
  const router = useRouter();

  const [verificationState, setVerificationState] =
    useState<EmailVerificationState>({
      isCodeSent: false,
      isVerified: false,
      timeRemaining: 0,
      canResend: false,
    });

  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  const [duplicateEmailError, setDuplicateEmailError] = useState<string | null>(
    null
  );

  const getSocialErrorTitle = (code: string) => {
    if (code.includes('kakao')) return '카카오와 연동된 계정이에요.';
    if (code.includes('google')) return '구글과 연동된 계정이에요.';
    return '이미 가입된 계정이에요.'; // fallback
  };

  // 카운트다운 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (verificationState.timeRemaining > 0) {
      timer = setTimeout(() => {
        setVerificationState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (
      verificationState.isCodeSent &&
      verificationState.timeRemaining === 0
    ) {
      setVerificationState((prev) => ({
        ...prev,
        canResend: true,
      }));
    }

    return () => clearTimeout(timer);
  }, [verificationState.timeRemaining, verificationState.isCodeSent]);

  // 인증 요청
  const requestVerification = useCallback(async (email: string) => {
    await authApi.requestEmailVerification(email);

    setVerificationState({
      isCodeSent: true,
      isVerified: false,
      timeRemaining: DEFAULT_EXPIRES_IN,
      canResend: false,
    });
    return { success: true, message: '인증코드가 발송되었습니다.' };
  }, []);

  // 재요청
  const resendVerification = useCallback(async (email: string) => {
    try {
      const response = await authApi.requestEmailVerification(email);

      if (response.success) {
        setVerificationState({
          isCodeSent: true,
          isVerified: false,
          timeRemaining: DEFAULT_EXPIRES_IN,
          canResend: false,
        });
        return { success: true, message: '인증코드가 재발송되었습니다.' };
      } else {
        return {
          success: false,
          message: response.message || '인증코드 재발송에 실패했습니다.',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '인증코드 재발송에 실패했습니다.',
      };
    }
  }, []);

  // 인증코드 확인
  const verifyCode = useCallback(
    async (email: string, code: string) => {
      // 시간 만료 체크
      if (
        verificationState.isCodeSent &&
        verificationState.timeRemaining === 0
      ) {
        return {
          success: false,
          message: '인증 시간이 만료되었습니다. 인증코드를 재발송해주세요.',
        };
      }

      setIsVerifyLoading(true);
      try {
        const response = await authApi.verifyEmailCode(email, code);

        if (response.success) {
          setVerificationState((prev) => ({
            ...prev,
            isVerified: true,
            timeRemaining: 0,
          }));
          return {
            success: true,
            message: response.message || '이메일 인증이 완료되었습니다.',
          };
        } else {
          return {
            success: false,
            message: response.message || '인증코드가 일치하지 않습니다.',
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || '인증 확인에 실패했습니다.',
        };
      } finally {
        setIsVerifyLoading(false);
      }
    },
    [verificationState.isCodeSent, verificationState.timeRemaining]
  );

  // 상태 초기화
  const resetVerification = useCallback(() => {
    setVerificationState({
      isCodeSent: false,
      isVerified: false,
      timeRemaining: 0,
      canResend: false,
    });
  }, []);

  // 시간 포매팅 유틸리티
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // 인증 요청 핸들러
  const handleRequestVerification = useCallback(
    async (email: string) => {
      setDuplicateEmailError(null); // 재요청 시 초기화

      // trigger가 제공된 경우에만 유효성 검사
      if (trigger) {
        const emailValid = await trigger('email');
        if (!emailValid) return { success: false, message: '' };
      }

      setIsRequestLoading(true);

      try {
        const result = await requestVerification(email);
        showModal({
          type: 'snackbar',
          description: result.message,
        });
        return result;
      } catch (error: any) {
        if (error.status === 409) {
          if (error.code === 'already_registered_basic_email') {
            setDuplicateEmailError('이미 사용 중인 이메일입니다.');
          } else {
            showModal({
              type: 'two-button',
              title: getSocialErrorTitle(error.code),
              description: '로그인 페이지로 이동하시겠습니까?',
              buttonText: '이동하기',
              onConfirm: () => {
                router.push('/login');
              },
            });
          }
        } else {
          showModal({
            type: 'snackbar',
            description: error.message || '인증 메일 발송에 실패했습니다.',
          });
        }
      } finally {
        setIsRequestLoading(false);
      }
    },
    [trigger, requestVerification, router]
  );

  // 재요청 핸들러
  const handleResendVerification = useCallback(
    async (email: string) => {
      setIsRequestLoading(true);
      try {
        const result = await resendVerification(email);
        showModal({
          type: 'snackbar',
          description: result.message,
        });
        return result;
      } finally {
        setIsRequestLoading(false);
      }
    },
    [resendVerification]
  );

  // 인증코드 확인 핸들러
  const handleVerifyCode = useCallback(
    async (email: string) => {
      // trigger와 watch가 제공된 경우에만 유효성 검사
      if (trigger && watch) {
        const codeValid = await trigger('verificationCode');
        if (!codeValid) return { success: false, message: '' };

        const verificationCode = watch('verificationCode');
        const result = await verifyCode(email, verificationCode);
        showModal({
          type: 'snackbar',
          description: result.message,
        });
        return result;
      }

      return { success: false, message: '폼 검증 함수가 제공되지 않았습니다.' };
    },
    [trigger, watch, verifyCode]
  );

  return {
    verificationState,
    isRequestLoading,
    isVerifyLoading,
    requestVerification,
    resendVerification,
    verifyCode,
    resetVerification,
    formatTime,
    duplicateEmailError,
    // 핸들러 함수들
    handleRequestVerification,
    handleResendVerification,
    handleVerifyCode,
    // 편의 속성들
    isCodeSent: verificationState.isCodeSent,
    isVerified: verificationState.isVerified,
    canResend: verificationState.canResend,
    timeRemaining: verificationState.timeRemaining,
    formattedTime: formatTime(verificationState.timeRemaining),
  };
};
