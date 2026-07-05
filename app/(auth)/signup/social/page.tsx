import SocialSignupForm from '@/components/auth/social/socialSignupForm';

export default function SocialSignupPage() {
  return (
    <div className="container mx-auto max-w-120 px-10 pt-10 pb-21">
      <h1 className="pb-10 text-center text-2xl font-bold max-md:hidden">
        회원가입
      </h1>
      <SocialSignupForm />
    </div>
  );
}
