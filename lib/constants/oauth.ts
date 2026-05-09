export const VALID_PROVIDERS = [
  'BASIC',
  'KAKAO',
  'GOOGLE',
  'NAVER',
  'BASIC_KAKAO',
  'BASIC_GOOGLE',
] as const;

/**
 * 백엔드 API 명세에 따른 소셜 플랫폼 타입
 */
export type AuthProvider = (typeof VALID_PROVIDERS)[number];

export const VALID_PARAM_PROVIDERS = ['kakao', 'google'] as const;

export type AuthProviderParam = (typeof VALID_PARAM_PROVIDERS)[number];

export function isValidProvider(value: string): value is AuthProviderParam {
  return (VALID_PARAM_PROVIDERS as readonly string[]).includes(value);
}

/**
 * 소셜 로그인(카카오, 구글) 인증 관련 상수
 */

/** 카카오 */

// const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
// const KAKAO_REDIRECT_URL = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL;
// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

/** 구글 */

// const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
// const GOOGLE_REDIRECT_URL = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;
// export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;

// TODO: state 매개변수 추가
export const SOCIAL_CONFLICT_MESSAGES: Record<string, string> = {
  already_registered_with_google: '당신은 구글로 가입했습니다.',
  already_registered_with_kakao: '당신은 카카오로 가입했습니다.',
};
export type OAuthIntent =
  | { action: 'LOGIN' }
  | { action: 'SIGNOUT' }
  | { action: 'LINK' }
  | { action: 'UNLINK' };
