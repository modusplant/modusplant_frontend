import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL } from '@/lib/constants/oauth';
import Image from 'next/image';

const SOCIAL_PLATFORMS = [
  {
    id: 'google',
    label: '구글 로그인',
    icon: '/icon/google-enabled.svg',
    url: GOOGLE_AUTH_URL,
  },
  {
    id: 'kakao',
    label: '카카오 로그인',
    icon: '/icon/kakao-enabled.svg',
    url: KAKAO_AUTH_URL,
  },
] as const;

const handleSocialLoginClick = (id: string) => {
  const platform = SOCIAL_PLATFORMS.find((s) => s.id === id);
  if (platform) {
    window.location.href = platform.url;
  }
};

interface SocialIconButtonProps {
  size?: number;
}
export default function SocialIconButton({ size = 45 }: SocialIconButtonProps) {
  return (
    <>
      {SOCIAL_PLATFORMS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleSocialLoginClick(id)}
          aria-label={label}
          className="transition-opacity hover:opacity-80"
        >
          <Image src={icon} alt={label} width={size} height={size} />
        </button>
      ))}
    </>
  );
}
