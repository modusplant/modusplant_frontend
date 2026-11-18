import { isValidProvider } from '@/lib/constants/oauth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: RouteContext<'/oauth/[provider]/authorize'>
) {
  const { provider } = await params;
  const state = request.nextUrl.searchParams.get('state');

  if (!isValidProvider(provider) || !state) {
    return NextResponse.json(
      { error: 'Invalid OAuth request' },
      { status: 400 }
    );
  }

  const isKakao = provider === 'kakao';
  const clientId = isKakao
    ? process.env.KAKAO_CLIENT_ID
    : process.env.GOOGLE_CLIENT_ID;
  const redirectUrl = isKakao
    ? process.env.KAKAO_REDIRECT_URL
    : process.env.GOOGLE_REDIRECT_URL;

  if (!clientId) {
    return NextResponse.json(
      { error: 'OAuth provider is not configured' },
      { status: 503 }
    );
  }

  const url = new URL(
    isKakao
      ? 'https://kauth.kakao.com/oauth/authorize'
      : 'https://accounts.google.com/o/oauth2/v2/auth'
  );
  url.searchParams.set('client_id', clientId);
  url.searchParams.set(
    'redirect_uri',
    redirectUrl || new URL(`/oauth/${provider}/callback`, request.url).href
  );
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  if (!isKakao) url.searchParams.set('scope', 'email profile');

  return NextResponse.redirect(url, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
