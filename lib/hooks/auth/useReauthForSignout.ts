import { AuthProvider } from '@/lib/types/member';

export const useReauthForSignout = (provider?: AuthProvider) => {
  const getAuthUrl = (prompt: 'none' | 'login') => {
    const base =
      provider === 'Kakao'
        ? `https://kauth.kakao.com/oauth/authorize`
        : `https://accounts.google.com/o/oauth2/v2/auth`;

    const params = new URLSearchParams({
      client_id:
        process.env[`NEXT_PUBLIC_${provider?.toUpperCase()}_CLIENT_ID`]!,
      redirect_uri:
        process.env[`NEXT_PUBLIC_${provider?.toUpperCase()}_REDIRECT_URL`]!,
      response_type: 'code',
      prompt,
      ...(provider === 'Google' && { scope: 'openid email' }),
    });

    return `${base}?${params}`;
  };

  const requestReauth = () => {
    if (!provider) return;
    return new Promise<string>((resolve, reject) => {
      const popup = window.open(
        getAuthUrl('none'),
        'reauth',
        'width=500,height=600'
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }
        window.removeEventListener('message', handleMessage);

        if (event.data.type === `${provider.toUpperCase()}_AUTH_SUCCESS`) {
          resolve(event.data.code);
        }

        if (event.data.type === `${provider.toUpperCase()}_AUTH_FALLBACK`) {
          const fallbackPopup = window.open(
            getAuthUrl('login'),
            'reauth_fallback',
            'width=500,height=600'
          );

          const handleFallback = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
              return;
            }
            window.removeEventListener('message', handleFallback);

            if (event.data.type === `${provider.toUpperCase()}_AUTH_SUCCESS`) {
              resolve(event.data.code);
            } else {
              reject(new Error('재인증 실패'));
            }
          };

          window.addEventListener('message', handleFallback);
        }
      };
      window.addEventListener('message', handleMessage);
    });
  };

  return { requestReauth };
};
