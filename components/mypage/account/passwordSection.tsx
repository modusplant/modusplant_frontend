import Link from 'next/link';
import { Button } from '@/components/_common/button';

/**
 * 비밀번호 변경 섹션
 * - 비밀번호 변경 안내 메시지
 * - 비밀번호 변경 버튼
 */
export default function PasswordSection() {
  return (
    <div className="border-surface-98 rounded-xl border bg-white p-10">
      <div className="flex flex-col gap-5">
        <label className="text-neutral-5 text-[18px] leading-normal font-semibold tracking-[-0.02em]">
          비밀번호
        </label>
        <div className="flex flex-col gap-6">
          <p className="text-neutral-20">
            보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.
          </p>
          <hr className="border-surface-stroke-2" />
          <div className="flex items-center gap-3">
            <Link href="/reset-password">
              <Button
                variant="point2"
                size="md"
                className="h-10.5 text-[15px] font-medium"
              >
                비밀번호 변경하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
