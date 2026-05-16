import SocialIconButtonGroup from '@/components/auth/login/socialIconButtonGroup';
import {
  AuthProvider,
  AuthProviderParam,
  PROVIDER_LABEL,
  SOCIAL_PROVIDER_MESSAGES,
} from '@/lib/constants/oauth';
import useModalStore from '@/lib/store/modalStore';
import { buildAuthUrl } from '@/lib/utils/oauth/buildAuthUrl';
import { parseAuthProvider } from '@/lib/utils/oauth/parseAuthProvider';

interface SocialLinkSectionProps {
  authProvider: AuthProvider;
  onSignout: () => void;
}

/** 순수 소셜 회원: 연동 해제 불가, 클릭 시 탈퇴 플로우로 연결 */
const SOCIAL_ONLY_PROVIDERS: AuthProvider[] = ['GOOGLE', 'KAKAO'];
/** 소셜 연동 회원: 연동 해제 가능 */
const LINKED_PROVIDERS: AuthProvider[] = ['BASIC_GOOGLE', 'BASIC_KAKAO'];

export default function SocialLinkSection({
  authProvider,
  onSignout,
}: SocialLinkSectionProps) {
  const showModal = useModalStore((state) => state.showModal);
  const connectedProvider = parseAuthProvider(authProvider);

  const handleSocialConnectClick = async (provider: AuthProviderParam) => {
    // 미연동 일반 회원 → LINK 플로우
    if (authProvider === 'BASIC') {
      const url = buildAuthUrl({ provider, intent: { action: 'LINK' } });
      window.location.href = url;
    }

    // 순수 소셜 회원 → 탈퇴 모달
    if (SOCIAL_ONLY_PROVIDERS.includes(authProvider)) {
      showModal({
        title: '회원 탈퇴',
        description: `${PROVIDER_LABEL[provider]} 계정과의 연동 해제 후, 회원 탈퇴가 진행됩니다.\n정말 탈퇴하시겠어요?`,
        shouldUseLineBreak: true,
        align: 'center',
        type: 'two-button',
        buttonText: '탈퇴하기',
        onConfirm: onSignout,
      });
    }

    // 소셜 연동 회원 → 연동 해제 모달
    if (LINKED_PROVIDERS.includes(authProvider)) {
      showModal({
        title: '연동 해제',
        description: `${PROVIDER_LABEL[provider]} 계정과의 연동이 해제됩니다.\n정말 연동을 해제하시겠어요?`,
        shouldUseLineBreak: true,
        align: 'center',
        type: 'two-button',
        buttonText: '연동 해제',
        onConfirm: () => {
          // 연동 해제 플로우로 리다이렉트
          window.location.href = buildAuthUrl({
            provider,
            intent: { action: 'UNLINK' },
          });
        },
      });
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
