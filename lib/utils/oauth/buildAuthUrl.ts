import { AuthProviderParam, OAuthIntent } from '@/lib/constants/oauth';

function encodeState(intent: OAuthIntent) {
  return btoa(JSON.stringify(intent));
}

export function buildAuthUrl({
  provider,
  intent,
}: {
  provider: AuthProviderParam;
  intent: OAuthIntent;
}) {
  const state = encodeState(intent);

  const configs: Record<
    AuthProviderParam,
    {
      clientId: string;
      redirectUrl: string;
      baseUrl: string;
      params: Record<string, string>;
    }
  > = {
    kakao: {
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
      redirectUrl: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL!,
      baseUrl: 'https://kauth.kakao.com/oauth/authorize',
      params: { response_type: 'code' },
    },
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirectUrl: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL!,
      baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      params: { response_type: 'code', scope: 'email profile' },
    },
  };

  const config = configs[provider];
  const url = new URL(config.baseUrl);

  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', config.redirectUrl);
  url.searchParams.set('state', state);
  Object.entries(config.params).forEach(([k, v]) => url.searchParams.set(k, v));

  return url.toString();
}
