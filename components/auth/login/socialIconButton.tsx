import { AuthProviderParam } from '@/lib/constants/oauth';
import Image from 'next/image';

const SOCIAL_PLATFORMS: Record<
  AuthProviderParam,
  { label: string; icon: string; unconnectedIcon: string }
> = {
  google: {
    label: '구글',
    icon: '/icon/google-enabled.svg',
    unconnectedIcon: '/icon/google-disabled.svg',
  },
  kakao: {
    label: '카카오',
    icon: '/icon/kakao-enabled.svg',
    unconnectedIcon: '/icon/kakao-disabled.svg',
  },
};

interface SocialIconButtonProps {
  mode: 'login' | 'mypage_link';
  connectedProvider?: AuthProviderParam | null;
  size?: number;
  onProviderClick: (provider: AuthProviderParam) => void;
}

export default function SocialIconButton({
  mode,
  connectedProvider,
  size = 45,
  onProviderClick,
}: SocialIconButtonProps) {
  const providers = Object.keys(SOCIAL_PLATFORMS) as AuthProviderParam[];

  return (
    <>
      {providers.map((provider) => {
        const { label, icon, unconnectedIcon } = SOCIAL_PLATFORMS[provider];

        const isConnected = connectedProvider === provider;
        const disabled =
          mode === 'mypage_link' && connectedProvider !== null && !isConnected;

        const src =
          mode === 'login' ? icon : isConnected ? icon : unconnectedIcon;

        return (
          <button
            key={provider}
            type="button"
            disabled={disabled}
            onClick={() => onProviderClick(provider)}
            aria-label={`${label} ${disabled ? '(연동 불가)' : ''}`}
            className="transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Image src={src} alt={label} width={size} height={size} />
          </button>
        );
      })}
    </>
  );
}
