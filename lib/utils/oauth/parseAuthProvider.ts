import { AuthProvider } from '@/lib/constants/oauth';

export function parseAuthProvider(
  provider: AuthProvider
): 'kakao' | 'google' | null {
  if (provider.includes('KAKAO')) return 'kakao';
  if (provider.includes('GOOGLE')) return 'google';
  return null;
}
