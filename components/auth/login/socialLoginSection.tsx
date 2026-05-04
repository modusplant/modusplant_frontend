import SocialIconButton from './socialIconButton';
import { buildAuthUrl } from '@/lib/utils/oauth/buildAuthUrl';

const SOCIAL_PLATFORMS = [
  {
    id: 'google',
    label: '구글 로그인',
    icon: '/icon/google-enabled.svg',
    url: buildAuthUrl({ provider: 'google', intent: { action: 'LOGIN' } }),
  },
  {
    id: 'kakao',
    label: '카카오 로그인',
    icon: '/icon/kakao-enabled.svg',
    url: buildAuthUrl({ provider: 'kakao', intent: { action: 'LOGIN' } }),
  },
] as const;

export default function SocialLoginSection() {
  const handleSocialLoginClick = (id: string) => {
    const platform = SOCIAL_PLATFORMS.find((s) => s.id === id);
    if (platform) {
      window.location.href = platform.url;
    }
  };

  return (
    <div className="mt-10 mb-3 flex items-center justify-center gap-4">
      <SocialIconButton mode="login" onProviderClick={handleSocialLoginClick} />
    </div>
  );
}
