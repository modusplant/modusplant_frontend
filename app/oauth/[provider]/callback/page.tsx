import { Suspense } from 'react';
import { OauthCallback } from './OAuthCallback';
import { isValidProvider, AuthProviderParam } from '@/lib/constants/oauth';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ provider: AuthProviderParam }> };

export default async function OAuthCallbackPage({ params }: Props) {
  const { provider } = await params;

  if (!isValidProvider(provider)) {
    notFound();
  }
  return (
    <Suspense
      fallback={
        <div>{provider === 'google' ? '구글' : '카카오'} 로그인 처리 중...</div>
      }
    >
      <OauthCallback provider={provider} />
    </Suspense>
  );
}
