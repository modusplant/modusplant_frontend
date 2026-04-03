import { ApiResponse } from '@/lib/types/common';
import { clientApiInstance } from '../instances/clientInstance';
import { AUTH_ENDPOINTS } from '@/lib/constants/endpoints';
/**
 * 소셜 인증 API
 */
export const OauthApi = {
  /**
   * 카카오 로그인
   */
  async kakaoLogin(
    code: string
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await clientApiInstance.post<{ accessToken: string }>(
      AUTH_ENDPOINTS.KAKAO_LOGIN,
      { code },
      { skipAuth: true }
    );
    return response;
  },
};
