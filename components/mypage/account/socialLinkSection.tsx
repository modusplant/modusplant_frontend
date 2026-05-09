import SocialIconButtonGroup from '@/components/auth/login/socialIconButtonGroup';
import {
  AuthProvider,
  AuthProviderParam,
  SOCIAL_PROVIDER_MESSAGES,
} from '@/lib/constants/oauth';
import { parseAuthProvider } from '@/lib/utils/oauth/parseAuthProvider';

interface SocialLinkSectionProps {
  authProvider: AuthProvider;
}

export default function SocialLinkSection({
  authProvider,
}: SocialLinkSectionProps) {
  const connectedProvider = parseAuthProvider(authProvider);

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

        {SOCIAL_PROVIDER_MESSAGES[authProvider] && (
          <div className="text-neutral-60 text-[13px]">
            {SOCIAL_PROVIDER_MESSAGES[authProvider]}
          </div>
        )}
      </div>
    </div>
  );
}
