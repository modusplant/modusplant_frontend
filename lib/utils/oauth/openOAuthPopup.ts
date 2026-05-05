import { OAuthIntent, AuthProviderParam } from '@/lib/constants/oauth';
import { buildAuthUrl } from './buildAuthUrl';

function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function openOAuthPopup({
  provider,
  intent,
}: {
  provider: AuthProviderParam;
  intent: OAuthIntent;
}): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const url = buildAuthUrl({ provider, intent });

    if (isMobile()) {
      window.location.href = url;
      return new Promise(() => {});
    }

    const popup = window.open(
      url,
      'oauthPopup',
      'width=500,height=700,left=400,top=100'
    );

    if (!popup) {
      reject(
        new Error('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.')
      );
      return;
    }

    const POLL_INTERVAL = 500;

    const timer = setInterval(() => {
      // 1. 팝업이 닫힌 경우 (사용자가 그냥 닫음)
      // COOP로 popup.closed가 차단되는 경우도 있어서 try-catch로 감쌈
      try {
        if (popup.closed) {
          cleanup();
          reject(new Error('인증이 취소되었습니다.'));
          return;
        }
      } catch {
        // popup.closed 접근 자체가 막힌 경우 → 다른 오리진 페이지에 있는 것
        // 아직 인가 진행 중이므로 계속 폴링
        return;
      }

      // 2. 팝업이 callback URL에 도달했는지 확인
      // 같은 오리진일 때만 href 접근 가능
      try {
        const popupUrl = new URL(popup.location.href);

        if (popupUrl.pathname.startsWith(`/oauth/${provider}/callback`)) {
          const code = popupUrl.searchParams.get('code');
          const error = popupUrl.searchParams.get('error');

          cleanup();

          if (code) {
            popup.close();
            resolve({ code });
          } else {
            popup.close();
            reject(new Error(error ?? '인증에 실패했습니다.'));
          }
        }
      } catch {
        // 다른 오리진(카카오 서버 등)에 있을 때 href 접근 시 SecurityError 발생
        // 정상적인 상황이므로 무시하고 계속 폴링
      }
    }, POLL_INTERVAL);

    const cleanup = () => clearInterval(timer);
  });
}
