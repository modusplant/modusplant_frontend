'use client';

import { useEffect } from 'react';
import { showModal } from '@/lib/store/modalStore';
import { SOCIAL_CONFLICT_MESSAGES } from '@/lib/constants/oauth';

export function useOAuthNotification() {
  useEffect(() => {
    // 다른 소셜 계정으로 가입된 이메일로 로그인 시도 시 알림 처리
    const authError = sessionStorage.getItem('authError');
    const authCode = sessionStorage.getItem('authCode');

    if (authError) {
      showModal({
        type: 'snackbar',
        description: SOCIAL_CONFLICT_MESSAGES[authCode ?? ''] ?? authError,
      });
      sessionStorage.removeItem('authError');
      sessionStorage.removeItem('authCode');
    }

    // 소셜 계정 연동 해제 후 안내 알림 처리
    const unlinkSuccess = sessionStorage.getItem('unlinkSuccess');

    if (unlinkSuccess) {
      showModal({
        type: 'snackbar',
        description:
          '소셜 연동이 해제되었습니다.\n다시 로그인 후 이용해주세요.',
      });
      sessionStorage.removeItem('unlinkSuccess');
    }
  }, []);
}
