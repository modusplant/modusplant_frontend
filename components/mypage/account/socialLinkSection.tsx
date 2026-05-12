import SocialIconButtonGroup from '@/components/auth/login/socialIconButtonGroup';
import { AuthProvider, AuthProviderParam } from '@/lib/constants/oauth';

interface SocialLinkSectionProps {
  authProvider: AuthProvider;
}

const GOOGLE_LABEL = '구글로 가입된 계정입니다.';
const KAKAO_LABEL = '카카오로 가입된 계정입니다.';
const BASIC_LABEL = '연동된 소셜 계정이 없습니다.';

const SOCIAL_PROVIDER_LABEL: Partial<Record<AuthProvider, string>> = {
  BASIC_GOOGLE: GOOGLE_LABEL,
  GOOGLE: GOOGLE_LABEL,
  BASIC_KAKAO: KAKAO_LABEL,
  KAKAO: KAKAO_LABEL,
  BASIC: BASIC_LABEL,
};

const getConnectedProvider = (authProvider: AuthProvider) => {
  if (authProvider.includes('GOOGLE')) return 'google';
  if (authProvider.includes('KAKAO')) return 'kakao';
  return null;
};

export default function SocialLinkSection({
  authProvider,
}: SocialLinkSectionProps) {
  const connectedProvider = getConnectedProvider(authProvider);

  const handleSocialConnectClick = async (provider: AuthProviderParam) => {
    if (connectedProvider === provider) {
      // 이미 연동된 소셜 계정의 경우 연동 해제 API 호출
      // TODO: 연동 해제 확인 모달
      console.log('연동 해제 API 호출:', provider);
    } else {
      // 미연동 상태 클릭할 경우 연동 API 호출(소셜 콜백 페이지로 이동)
      // window.location.href = SOCIAL_AUTH_URLS[provider]('mypage_link');
      console.log('연동 API 호출:', provider);
    }
  };

  return (
    <div className="border-surface-98 rounded-xl border bg-white p-10">
      <div className="flex flex-col gap-5">
        <label className="text-neutral-5 text-[18px] leading-normal font-semibold tracking-[-0.02em]">
          소셜 연동 관리
        </label>
        <div className="flex gap-4">
          <SocialIconButtonGroup
            mode="mypage_link"
            onProviderClick={handleSocialConnectClick}
            connectedProvider={connectedProvider}
          />
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
