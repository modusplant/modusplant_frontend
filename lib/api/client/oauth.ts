import { ApiResponse } from '@/lib/types/common';
import { clientApiInstance } from '../instances/clientInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
import { AuthProviderParam } from '@/lib/constants/oauth';
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
   * 소셜 회원가입
   */
  async socialSignup(
    body: SocialSignupRequest
  ): Promise<ApiResponse<{ type: 'LOGIN'; accessToken: string }>> {
    const response = await clientApiInstance.post<{
      type: 'LOGIN';
      accessToken: string;
    }>(AUTH_ENDPOINTS.SOCIAL_SIGNUP, body, { skipAuth: true });
    return response;
  },

  /**
   * 카카오 로그인
   */
  async kakaoLogin(code: string): Promise<ApiResponse<SocialLoginResponse>> {
    const response = await clientApiInstance.post<SocialLoginResponse>(
      AUTH_ENDPOINTS.SOCIAL_LOGIN('kakao'),
      { code },
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 구글 로그인
   */
  async googleLogin(code: string): Promise<ApiResponse<SocialLoginResponse>> {
    const response = await clientApiInstance.post<SocialLoginResponse>(
      AUTH_ENDPOINTS.SOCIAL_LOGIN('google'),
      { code },
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 소셜 연동
   */
  async socialLink(): Promise<
    ApiResponse<{ type: 'LOGIN'; accessToken: string }>
  > {
    const response = await clientApiInstance.post<{
      type: 'LOGIN';
      accessToken: string;
    }>(AUTH_ENDPOINTS.SOCIAL_LINK, { skipAuth: true });
    return response;
  },

  /**
   * 소셜 연결 취소 (연동 거부, 소셜 회원가입 중단)
   */
  async cancelSocialConnect(): Promise<ApiResponse<void>> {
    const response = await clientApiInstance.delete<void>(
      AUTH_ENDPOINTS.CANCEL_SOCIAL_CONNECT,
      { skipAuth: true }
    );
    return response;
  },

  /**
   * 마이페이지용 소셜 연동(일반회원) API
   */
  async mypageSocialLink(
    code: string,
    provider: AuthProviderParam
  ): Promise<ApiResponse> {
    const response = await clientApiInstance.post<ApiResponse>(
      AUTH_ENDPOINTS.MYPAGE_SOCIAL_LINK(provider),
      { code }
    );
    return response;
  },

  /**
   * 마이페이지용 소셜 연동 해제(소셜연동회원) API
   */
  async mypageSocialUnlink(
    code: string,
    provider: AuthProviderParam
  ): Promise<ApiResponse> {
    const response = await clientApiInstance.post<ApiResponse>(
      AUTH_ENDPOINTS.MYPAGE_SOCIAL_UNLINK(provider),
      { code }
    );
    return response;
  },
};
