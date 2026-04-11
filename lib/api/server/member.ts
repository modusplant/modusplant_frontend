import { serverApiInstance } from '@/lib/api/instances/serverInstance';
import { ApiResponse } from '@/lib/types/common';
import { ProfileData } from '@/lib/types/member';
import { MEMBER_ENDPOINTS } from '@/lib/constants/endpoints';

/**
 * 회원 프로필 API
 */
export const memberApi = {
  /**
   * 프로필 조회
   * GET /api/v1/members/{id}/profile
   */
  async getProfile(): Promise<ApiResponse<ProfileData>> {
    return serverApiInstance.get<ProfileData>(MEMBER_ENDPOINTS.PROFILE());
  },
};
