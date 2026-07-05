import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/auth/login/loginForm';
import { cn } from '@/lib/utils/tailwindHelper';
import { loginMetadata as metadata } from '@/lib/metadata/auth';

export { metadata };

export default function LoginPage() {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-white/70 p-5',
        'md:bg-surface-98 md:p-6'
      )}
    >
      {/* 로그인 카드 */}
      <div
        className={cn(
          'bg-white/70',
          'rounded-[20px] md:rounded-[28px]',
          'w-full max-w-120',
          'md:border-surface-stroke md:border md:p-12'
        )}
      >
        {/* 로고 영역 */}
        <div className="mb-8 flex flex-col items-center gap-1 md:mb-10">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo_favicon/Logo_v2_black.svg"
              alt="모두의식물"
              width={117}
              height={26}
              className="h-7.5 w-auto"
            />
          </Link>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </div>
  );
}
