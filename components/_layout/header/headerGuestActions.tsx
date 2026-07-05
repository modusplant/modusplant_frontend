import Link from 'next/link';
import { Button } from '@/components/_common/button';

export default function HeaderGuestActions() {
  return (
    <>
      {/* 로그인 버튼 */}
      <Link href="/login">
        <Button
          variant="default"
          size="sm"
          className="border-surface-stroke h-9 cursor-pointer rounded-full"
        >
          로그인
        </Button>
      </Link>
    </>
  );
}
