import { ApiResponse } from '@/lib/types/common';
import { clientApiInstance } from '../instances/clientInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
/**
 * 소셜 인증 API
 */

type SocialLoginResponse =
  | { type: 'LOGIN'; accessToken: string }
  | { type: 'NEED_SIGNUP'; email: string; nickname: string }
  | { type: 'NEED_LINK'; email: string; nickname: string };

interface SocialSignupRequest {
  nickname: string;
  introduction?: string;
  agreedTermsOfUseVersion: string;
  agreedPrivacyPolicyVersion: string;
  agreedCommunityPolicyVersion: string;
}

export const OauthApi = {
  /**
   * 카카오 로그인
   */
  async kakaoLogin(code: string): Promise<ApiResponse<SocialLoginResponse>> {
    const response = await clientApiInstance.post<SocialLoginResponse>(
      AUTH_ENDPOINTS.KAKAO_LOGIN,
      { code },
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 카카오 회원가입
   */
  async kakaoSignup(
    body: SocialSignupRequest
  ): Promise<ApiResponse<{ type: 'LOGIN'; accessToken: string }>> {
    const response = await clientApiInstance.post<{
      type: 'LOGIN';
      accessToken: string;
    }>(AUTH_ENDPOINTS.SOCIAL_SIGNUP, body, { skipAuth: true });
    return response;
  },

  /**
   * 구글 로그인
   */
  async googleLogin(code: string): Promise<ApiResponse<SocialLoginResponse>> {
    const response = await clientApiInstance.post<SocialLoginResponse>(
      AUTH_ENDPOINTS.GOOGLE_LOGIN,
      { code },
      { skipAuth: true }
    );
    return response;
  },
};
