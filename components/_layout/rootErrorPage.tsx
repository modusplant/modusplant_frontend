'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/_common/button';

interface RootErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function RootErrorPage({ error, reset }: RootErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 py-15">
        <div className="relative h-25 w-25">
          <Image
            src="/character_sad.svg"
            alt="오류 발생"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <h2 className="text-neutral-10 text-base leading-[1.19] font-semibold tracking-[-0.02em]">
            잠시 문제가 생겼어요
          </h2>
          <p className="text-neutral-40 text-center text-[15px] leading-normal font-normal tracking-[-0.02em]">
            <span>예기치 못한 오류가 발생했어요.</span>
            <br />
            <span>다시 시도하거나 홈으로 돌아가보세요.</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button variant="point" size="md" onClick={reset}>
            다시 시도
          </Button>
          <Link
            href="/"
            className="border-surface-stroke text-neutral-20 flex h-12 items-center justify-center gap-2.25 rounded-[31px] border px-6 py-4 text-base leading-[1.2] font-medium tracking-[-0.03em]"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
