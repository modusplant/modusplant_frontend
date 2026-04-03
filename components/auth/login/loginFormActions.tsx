'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/_common/button';
import { KAKAO_AUTH_URL } from '@/lib/constants/socialAuth';

interface LoginFormActionsProps {
  isLoading: boolean;
}

/**
 * 로그인폼 - 액션 영역
 * - 로그인 버튼
 * - 하단 네비게이션 링크 (비밀번호 재설정, 회원가입)
 * - 소셜 로그인
 */

const SOCIAL_PLATFORMS = [
  {
    id: 'google',
    label: '구글 로그인',
    icon: '/icon/google-enabled.svg',
    url: '', // TODO: 구글 로그인 구현 시 교체
  },
  {
    id: 'kakao',
    label: '카카오 로그인',
    icon: '/icon/kakao-enabled.svg',
    url: KAKAO_AUTH_URL,
  },
] as const;

const handleSocialLoginClick = (id: string) => {
  const platform = SOCIAL_PLATFORMS.find((s) => s.id === id);
  if (platform) {
    window.location.href = platform.url;
  }
};

export default function LoginFormActions({ isLoading }: LoginFormActionsProps) {
  return (
    <div>
      {/* 로그인 버튼 */}
      <Button
        type="submit"
        variant="point"
        size="md"
        fullWidth
        disabled={isLoading}
        className="h-13 rounded-[7px] py-5 text-[16px] font-semibold md:py-6"
      >
        {isLoading ? (
          <Image
            src={'/icon/loading.gif'}
            alt="Loading"
            width={20}
            height={20}
            unoptimized
          />
        ) : (
          '로그인'
        )}
      </Button>

      {/* 하단 링크 */}
      <div
        className="text-neutral-60 mt-8 flex items-center justify-center gap-2 text-sm"
        style={{ fontFamily: 'Pretendard' }}
      >
        <Link
          href="/reset-password"
          className="hover:text-neutral-20 transition-colors"
        >
          비밀번호 재설정
        </Link>
        <span className="text-neutral-80">ㅣ</span>
        <Link
          href="/signup"
          className="hover:text-neutral-20 transition-colors"
        >
          회원가입
        </Link>
      </div>

      {/* 소셜 로그인 */}
      <div className="mt-10 mb-3 flex items-center justify-center gap-4">
        {SOCIAL_PLATFORMS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSocialLoginClick(id)}
            aria-label={label}
            className="transition-opacity hover:opacity-80"
          >
            <Image src={icon} alt={label} width={45} height={45} />
          </button>
        ))}
      </div>
    </div>
  );
}
