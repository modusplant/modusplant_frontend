'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import StateMessage from '@/components/_common/stateMessage';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 전역 인증 가드 컴포넌트
 *
 * @description
 * - 인증이 필요한 보호 경로(마이페이지, 게시글 작성/수정, 알림, 이메일 변경)만 명시
 * - 그 외 경로(존재하지 않는 경로 포함)는 인증 없이 접근 가능
 * - 미인증 상태에서 보호된 경로 접근 시 로그인 안내 페이지 표시
 *
 * @example
 * ```tsx
 * // Root Layout에서 사용
 * <AuthGuard>
 *   {children}
 * </AuthGuard>
 * ```
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 인증이 필요한 보호 경로 목록
  const protectedPaths = [
    '/mypage',
    '/mypage/profile',
    '/mypage/account',
    '/mypage/posts',
    '/mypage/likes',
    '/mypage/bookmarks',
    '/mypage/comments',
    '/mypage/recent',
    '/mypage/report',
    '/mypage/menu',
    '/notifications',
    '/reset-email',
  ];

  const isProtectedPath =
    protectedPaths.includes(pathname) ||
    pathname.startsWith('/community/write');

  // 인징이 필요한 경로가 아닌 경우 children 렌더링
  if (!isProtectedPath || isAuthenticated) {
    return <>{children}</>;
  }

  // 미인증 상태에서 보호된 경로 접근 시 로그인 안내
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <StateMessage
        imageSrc="/character_sad.svg"
        title="로그인이 필요한 서비스예요"
        description="회원 전용 콘텐츠를 이용하려면\n먼저 로그인해주세요."
        buttonText="로그인하기"
        buttonHref="/login"
      />
    </div>
  );
}
