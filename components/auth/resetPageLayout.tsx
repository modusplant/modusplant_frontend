'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ResetPageLayoutProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/**
 * 뒤로가기 버튼 + 제목/설명 + 폼을 감싸는 공통 레이아웃
 * - reset-password, reset-email 등 인증 관련 재설정 플로우에서 재사용
 */
export default function ResetPageLayout({
  title,
  description,
  children,
}: ResetPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-120 p-5">
      {/* 뒤로가기 버튼 */}
      <div className="hidden md:block">
        <button
          onClick={() => router.back()}
          className="border-neutral-90 hover:bg-surface-98 mb-4 rounded-full border p-2 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="text-neutral-20 h-4 w-4" />
        </button>
      </div>

      {/* 페이지 제목 */}
      <div className="mt-6 mb-10 flex flex-col gap-6 text-center">
        <h1 className="hidden text-2xl font-bold md:block">{title}</h1>

        {description && (
          <h2 className="text-neutral-20 text-[15px]">{description}</h2>
        )}
      </div>

      {children}
    </div>
  );
}
