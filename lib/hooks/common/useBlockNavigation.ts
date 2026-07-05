import { useEffect } from 'react';

/**
 * 폼 데이터가 변경된 상태에서 페이지 이탈을 방지하는 훅
 *
 * 두 가지 이탈 케이스를 처리합니다
 * 1. 브라우저 새로고침 / 탭 닫기 (beforeunload)
 * 2. 브라우저 뒤로가기 / 앞으로가기 (popstate)
 *
 * @param isDirty - react-hook-form의 formState.isDirty 값
 * @param message - 이탈 방지 확인 메시지
 */
export const useBlockNavigation = (
  isDirty: boolean,
  message = '작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?'
) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      const confirmed = window.confirm(message);
      if (confirmed) {
        window.removeEventListener('popstate', handlePopState);
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty, message]);
};
