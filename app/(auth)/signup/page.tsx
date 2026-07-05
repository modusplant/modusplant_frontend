import SignupForm from '@/components/auth/signup/signupForm';
import { signupMetadata as metadata } from '@/lib/metadata/auth';

export { metadata };

export default function SignupPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="mb-16 w-full max-w-90 p-5 md:max-w-120 md:p-10 md:pb-20">
        <h1 className="mb-10 text-center text-2xl font-bold text-black max-md:hidden">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
