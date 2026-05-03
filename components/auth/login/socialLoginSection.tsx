import { SOCIAL_AUTH_URLS, SocialProvider } from '@/lib/constants/oauth';
import SocialIconButton from './socialIconButton';

export default function SocialLoginSection() {
  const handleSocialLoginClick = (provider: SocialProvider) => {
    window.location.href = SOCIAL_AUTH_URLS[provider]('login');
  };

  return (
    <div className="mt-10 mb-3 flex items-center justify-center gap-4">
      <SocialIconButton mode="login" onProviderClick={handleSocialLoginClick} />
    </div>
  );
}
