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

      {/* 회원가입 버튼 */}
      <Link href="/signup">
        <Button
          variant="point"
          size="sm"
          className="h-9 cursor-pointer rounded-full border-none"
        >
          회원가입
        </Button>
      </Link>
    </>
  );
}
