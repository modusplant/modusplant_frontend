import { clientApiInstance } from '@/lib/api/instances/clientInstance';
import { ApiResponse } from '@/lib/types/common';
import { ProfileData, AuthInfo } from '@/lib/types/member';
import { MEMBER_ENDPOINTS, buildQueryString } from '@/lib/constants/endpoints';
import {
  GetMyPostsRequest,
  GetMyPostsResponseData,
  GetRecentPostsRequest,
  GetRecentPostsResponseData,
} from '@/lib/types/post';

/**
 * 회원 프로필 API
 */
export const memberApi = {
  /**
   * 프로필 조회
   */
  async getProfile(userId: string): Promise<ApiResponse<ProfileData>> {
    return clientApiInstance.get<ProfileData>(MEMBER_ENDPOINTS.PROFILE(userId));
  },

  /**
   * 프로필 수정 (덮어쓰기)
   * Content-Type: multipart/form-data
   */
  async updateProfile(
    userId: string,
    formData: FormData
  ): Promise<ApiResponse<ProfileData>> {
    return clientApiInstance.put<ProfileData>(
      MEMBER_ENDPOINTS.PROFILE(userId),
      formData
    );
  },

  /**
   * 회원 인증 정보 조회
   */
  async getAuthInfo(userId: string): Promise<ApiResponse<AuthInfo>> {
    return clientApiInstance.get<AuthInfo>(MEMBER_ENDPOINTS.AUTH_INFO(userId));
  },

  /**
   * 최근에 본 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 최근에 본 게시글 목록 응답
   */
  async getRecentPosts(
    params: GetRecentPostsRequest
  ): Promise<ApiResponse<GetRecentPostsResponseData>> {
    const queryString = buildQueryString({
      page: params.page,
      size: params.size,
    });

    const endpoint = `${MEMBER_ENDPOINTS.MY_RECENT_POSTS}${queryString}`;

    return clientApiInstance.get<GetRecentPostsResponseData>(endpoint);
  },

  /**
   * 내가 작성한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 작성한 게시글 목록 응답
   */
  async getMyPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryString = buildQueryString({
      page: params.page,
      size: params.size,
    });

    const endpoint = `${MEMBER_ENDPOINTS.MY_POSTS}${queryString}`;

    return clientApiInstance.get<GetMyPostsResponseData>(endpoint);
  },

  /**
   * 내가 좋아요한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 좋아요한 게시글 목록 응답
   */
  async getLikedPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryString = buildQueryString({
      page: params.page,
      size: params.size,
    });

    const endpoint = `${MEMBER_ENDPOINTS.MY_LIKED_POSTS}${queryString}`;

    return clientApiInstance.get<GetMyPostsResponseData>(endpoint);
  },

  /**
   * 내가 북마크한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 북마크한 게시글 목록 응답
   */
  async getBookmarkedPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryString = buildQueryString({
      page: params.page,
      size: params.size,
    });

    const endpoint = `${MEMBER_ENDPOINTS.MY_BOOKMARKED_POSTS}${queryString}`;

    return clientApiInstance.get<GetMyPostsResponseData>(endpoint);
  },
};
