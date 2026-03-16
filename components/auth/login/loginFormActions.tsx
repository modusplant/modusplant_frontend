'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/_common/button';

interface LoginFormActionsProps {
  isLoading: boolean;
}

/**
 * 로그인폼 - 액션 영역
 * - 로그인 버튼
 * - 하단 네비게이션 링크 (비밀번호 재설정, 회원가입)
 */
export default function LoginFormActions({ isLoading }: LoginFormActionsProps) {
  return (
    <div className="space-y-8">
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
        className="text-neutral-60 flex items-center justify-center gap-2 text-sm"
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
    </div>
  );
}
