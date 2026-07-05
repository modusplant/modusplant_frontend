import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete({ name: 'accessToken', path: '/' });
  cookieStore.delete({ name: 'refreshToken', path: '/' });
  cookieStore.delete({ name: 'rememberMe', path: '/' });

  return NextResponse.json({ ok: true });
}
