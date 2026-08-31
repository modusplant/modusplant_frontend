import React from 'react';
import { decodeJWT } from '@/lib/utils/auth/decodeJWT';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = decodeJWT(token);

  if (!payload || payload.roles !== 'ADMIN') {
    redirect('/');
  }

  return <>{children}</>;
}
