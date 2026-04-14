import SignupForm from '@/components/auth/signup/signupForm';
import { signupMetadata as metadata } from '@/lib/metadata/auth';

export { metadata };

export default function SignupPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="w-full max-w-120 p-10">
        <h1 className="mb-10 text-center text-xl font-bold text-black md:text-2xl">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
