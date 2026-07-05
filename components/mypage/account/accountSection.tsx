'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useMemberAuthInfo } from '@/lib/hooks/mypage/useMemberAuthInfo';
import EmailInfoSection from './emailInfoSection';
import PasswordSection from './passwordSection';
import SocialLinkSection from './socialLinkSection';
import ChangeEmailModal from './changeEmailModal';
import { useEffect, useState } from 'react';
import SignoutModal from './SignoutModal';
import { useDropdownState } from '@/lib/hooks/category/useDropdownState';
import { useLinkError } from '@/lib/hooks/mypage/useLinkError';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignoutFormValues } from './SignoutForm';
import { useSignout } from '@/lib/hooks/auth/useSignout';
import { showModal } from '@/lib/store/modalStore';

/**
 * 계정 설정 섹션
 * - 이메일 정보
 * - 비밀번호 변경
 * - 가입일 (읽기 전용)
 */
export default function AccountSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const { isOpen: isSignoutModalOpen, open, close } = useDropdownState();

  const [savedFormValues, setSavedFormValues] = useState<
    SignoutFormValues | undefined
  >(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (
      new URLSearchParams(window.location.search).get('signout') !== 'pending'
    ) {
      return;
    }

    const raw = sessionStorage.getItem('signoutForm');
    if (!raw) return;
    return JSON.parse(raw) as SignoutFormValues;
  });

  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const { data: authInfo, isLoading, error } = useMemberAuthInfo(user?.id);

  const { executeSignout, handleSignout, error: signoutError } = useSignout();

  const isSocialMember = authInfo?.authProvider !== 'BASIC';

  useLinkError();

  useEffect(() => {
    if (searchParams.get('signout') !== 'pending') return;
    const signoutFormValues = JSON.parse(
      sessionStorage.getItem('signoutForm')!
    );
    const signoutCode = sessionStorage.getItem('signoutCode') ?? undefined;
    const signoutProvider =
      sessionStorage.getItem('signoutProvider') ?? undefined;

    router.replace('/mypage/account');
    open();

    executeSignout({
      formValues: signoutFormValues!,
      authCode: signoutCode,
      authProvider: signoutProvider,
    });
  }, []);

  const openSignoutModal = () => {
    setSavedFormValues(undefined);
    open();
  };

  const closeSignoutModal = () => {
    close();
    setSavedFormValues(undefined);
  };

  useEffect(() => {
    if (signoutError) {
      showModal({
        type: 'snackbar',
        description: '회원탈퇴에 실패했어요. 다시 시도해주세요.',
      });
    }
  }, [signoutError]);

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-neutral-60">로딩 중...</p>
      </div>
    );
  }

  if (error || !authInfo) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-system-alert">계정 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {emailModalVisible && (
        <ChangeEmailModal
          userId={user!.id}
          email={user?.email || authInfo.email}
          close={() => setEmailModalVisible(false)}
        />
      )}
      <EmailInfoSection
        email={user?.email || authInfo.email}
        createdAt={authInfo.createdAt}
        onChangeEmail={() => setEmailModalVisible(true)}
        disabled={isSocialMember}
      />
      <SocialLinkSection
        authProvider={authInfo.authProvider}
        onSignout={open}
      />
      <PasswordSection disabled={isSocialMember} />
      <div className="flex justify-end">
        <button
          className="typo-regular14 text-neutral-40 text-[15px] underline underline-offset-4"
          onClick={openSignoutModal}
        >
          회원 탈퇴
        </button>
      </div>
      {isSignoutModalOpen && (
        <SignoutModal
          handleSignout={handleSignout}
          savedFormValues={savedFormValues}
          onClose={closeSignoutModal}
        />
      )}
    </div>
  );
}
