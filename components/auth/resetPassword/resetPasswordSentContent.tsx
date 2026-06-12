'use client';

import FixedBottomButton from '@/components/_common/fixedBottomButton';
import EmailSentNotice from './emailSentNotice';
import Button from '@/components/_common/button';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSentContent() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-56px-80px)] flex-col justify-center gap-10">
      <EmailSentNotice />
      <FixedBottomButton>
        <Button
          className="w-full rounded-lg py-3 text-[16px] font-semibold md:py-4"
          variant="point"
          onClick={() => router.push('/reset-password')}
        >
          돌아가기
        </Button>
      </FixedBottomButton>
    </div>
  );
}
