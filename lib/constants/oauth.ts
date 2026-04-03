/**
 * 소셜 로그인(카카오, 구글) 인증 관련 상수
 */

/** 카카오 */

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URL = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL;
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
