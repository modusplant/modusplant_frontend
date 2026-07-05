import { OAuthIntent } from '@/lib/constants/oauth';

// function isOAuthIntent(value: unknown): value is OAuthIntent {
//   if (typeof value !== 'object' || value == null) return false;
//   const v = value as Record<string, unknown>;
//   return v.action === 'LOGIN' || v.action === 'LINK_ACCOUNT';
// }
/**
 *
 * @param raw URL 문자열
 * @returns 복원된 객체 ex) { action: 'LOGIN' }
 */
export function parseState(raw: string | null): OAuthIntent | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(atob(raw));
    // return isOAuthIntent(parsed) ? parsed : null;
    return parsed;
  } catch {
    return null;
  }
}
