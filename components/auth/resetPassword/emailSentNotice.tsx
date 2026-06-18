'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function EmailSentNotice() {
  return (
    <div className="mx-auto flex max-w-80 flex-col gap-10">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/icon/check.svg"
          alt="Check Icon"
          width={120}
          height={120}
          loading="lazy"
        />
        <p className="text-center">
          이메일 전송이 완료되었습니다.
          <br /> 메일함을 확인해주세요.
        </p>
      </div>
      <p className="text-neutral-60 text-center text-sm">
        메일이 오지 않았다면,{' '}
        <span className="text-neutral-20">스팸메일함</span>을 확인하거나
        <br />
        <Link
          href="/reset-password"
          className="text-neutral-20 underline underline-offset-4 hover:text-neutral-50"
        >
          이메일 재전송
        </Link>
        을 해주세요.
      </p>
    </div>
  );
}
