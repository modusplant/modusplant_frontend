import { AuthProviderParam } from '@/lib/constants/oauth';
import SocialIconButtonGroup from './socialIconButtonGroup';
import { buildAuthUrl } from '@/lib/utils/oauth/buildAuthUrl';

export default function SocialLoginSection() {
  const handleSocialLoginClick = (provider: AuthProviderParam) => {
    const url = buildAuthUrl({ provider, intent: { action: 'LOGIN' } });
    window.location.href = url;
  };

  return (
    <div className="mt-10 mb-3 flex items-center justify-center gap-4">
      <SocialIconButtonGroup
        mode="login"
        onProviderClick={handleSocialLoginClick}
      />
    </div>
  );
}
