import SocialIconButton from '@/components/auth/login/socialIconButton';
import { AuthProvider } from '@/lib/types/member';

interface SocialLinkSectionProps {
  authProvider: AuthProvider;
}

const GOOGLE_LABEL = '구글로 가입된 계정입니다.';
const KAKAO_LABEL = '카카오로 가입된 계정입니다.';

const SOCIAL_PROVIDER_LABEL: Partial<Record<AuthProvider, string>> = {
  BASIC_GOOGLE: GOOGLE_LABEL,
  GOOGLE: GOOGLE_LABEL,
  BASIC_KAKAO: KAKAO_LABEL,
  KAKAO: KAKAO_LABEL,
};

export default function SocialLinkSection({
  authProvider,
}: SocialLinkSectionProps) {
  return (
    <div className="border-surface-98 rounded-xl border bg-white p-10">
      <div className="flex flex-col gap-5">
        <label className="text-neutral-5 text-[18px] leading-normal font-semibold tracking-[-0.02em]">
          소셜 연동 관리
        </label>
        <div className="flex gap-4">
          <SocialIconButton />
        </div>

        {SOCIAL_PROVIDER_LABEL[authProvider] && (
          <div className="text-neutral-60 text-[13px]">
            {SOCIAL_PROVIDER_LABEL[authProvider]}
          </div>
        )}
      </div>
    </div>
  );
}
