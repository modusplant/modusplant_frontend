import { AuthProvider } from '@/lib/constants/oauth';

export function parseAuthProvider(
  provider: AuthProvider
): 'kakao' | 'google' | undefined {
  if (provider.includes('KAKAO')) return 'kakao';
  if (provider.includes('GOOGLE')) return 'google';
  return;
}
