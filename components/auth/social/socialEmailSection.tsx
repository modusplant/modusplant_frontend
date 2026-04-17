'use client';

/**
 * 소셜 회원가입용 이메일 섹션으로,
 * 인증요청 버튼이 없고 전달받은 이메일이 작성되어 있습니다.
 */

import { Input } from '@/components/_common/input';

interface SocialEmailSectionProps {
  email: string;
}

export default function SocialEmailSection({ email }: SocialEmailSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-0.5">
        <label htmlFor="email" className="text-neutral-20 text-sm font-medium">
          이메일
        </label>
        <span className="text-primary-40 text-sm font-medium">*</span>
      </div>
      <Input
        id="email"
        type="email"
        value={email}
        readOnly
        className="bg-surface-98 pointer-events-none"
      />
    </div>
  );
}
