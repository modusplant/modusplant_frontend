import { clientApiInstance } from '@/lib/api/instances/clientInstance';
import { ApiResponse } from '@/lib/types/common';
import { ProfileData, AuthInfo } from '@/lib/types/member';
import {
  MEMBER_ENDPOINTS,
  COMMENT_ENDPOINTS,
  buildQueryString,
} from '@/lib/constants/endpoints';
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
  async getProfile(): Promise<ApiResponse<ProfileData>> {
    return clientApiInstance.get<ProfileData>(MEMBER_ENDPOINTS.PROFILE());
  },

  /**
   * 프로필 수정 (덮어쓰기)
   * Content-Type: multipart/form-data
   */
  async updateProfile(payload: {
    nickname: string;
    introduction: string;
    fileKey?: string;
  }): Promise<ApiResponse<ProfileData>> {
    const queryString = buildQueryString({
      nickname: payload.nickname,
      introduction: payload.introduction,
      fileKey: payload.fileKey,
    });

    return clientApiInstance.put<ProfileData>(
      `${MEMBER_ENDPOINTS.UPDATE_PROFILE()}${queryString}`
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

  /**
   * 건의/버그 제보
   * @param payload 제목/내용/첨부 이미지 fileKey 목록
   * @returns 응답
   */
  async postBugReport(payload: {
    title: string;
    content: string;
    fileKeys: string[];
  }): Promise<ApiResponse<void>> {
    const queryString = buildQueryString({
      title: payload.title,
      content: payload.content,
      fileKeys: payload.fileKeys,
    });

    return clientApiInstance.post<void>(
      `${MEMBER_ENDPOINTS.MY_BUG_REPORTS}${queryString}`
    );
  },

  /**
   * 댓글 신고
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로
   * @returns 응답
   */
  async postCommentReport(
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(
      COMMENT_ENDPOINTS.REPORT_COMMENTS(postUlid, path)
    );
  },
};
