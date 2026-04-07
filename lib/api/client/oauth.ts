import { ApiResponse } from '@/lib/types/common';
import { clientApiInstance } from '../instances/clientInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
/**
 * 소셜 인증 API
 */

type KakaoLoginResponse =
  | { type: 'LOGIN'; accessToken: string }
  | { type: 'NEED_SIGNUP'; email: string; nickname: string }
  | { type: 'NEED_LINK'; email: string; nickname: string };
export const OauthApi = {
  /**
   * 카카오 로그인
   */
  async kakaoLogin(code: string): Promise<ApiResponse<KakaoLoginResponse>> {
    const response = await clientApiInstance.post<KakaoLoginResponse>(
      AUTH_ENDPOINTS.KAKAO_LOGIN,
      { code },
      { skipAuth: true }
    );
    return response;
  },
};
