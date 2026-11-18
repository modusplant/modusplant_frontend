import type { AuthProviderParam, OAuthIntent } from '@/lib/constants/oauth';

export function buildAuthUrl({
  provider,
  intent,
}: {
  provider: AuthProviderParam;
  intent: OAuthIntent;
}) {
  const searchParams = new URLSearchParams({
    state: btoa(JSON.stringify(intent)),
  });
  return `/oauth/${provider}/authorize?${searchParams}`;
}
