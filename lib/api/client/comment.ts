import { clientApiInstance } from '../instances/clientInstance';
import { ApiResponse } from '@/lib/types/common';
import {
  Comment,
  CommentCreatePayload,
  GetMyCommentsRequest,
  GetMyCommentsResponseData,
} from '@/lib/types/comment';
import { COMMENT_ENDPOINTS, buildQueryString } from '@/lib/constants/endpoints';

/**
 * 댓글 관련 API
 */
export const commentApi = {
  /**
   * 특정 게시글의 댓글 목록 조회
   * @param postId 게시글 ID (ULID)
   * @returns 댓글 목록 (플랫 배열)
   */
  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    return clientApiInstance.get<Comment[]>(
      COMMENT_ENDPOINTS.POST_COMMENTS(postId)
    );
  },

  /**
   * 댓글 추가
   * @param payload 댓글 생성 페이로드
   * @returns 성공 응답
   */
  async createComment(
    payload: CommentCreatePayload
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.post<void>(COMMENT_ENDPOINTS.COMMENTS, payload);
  },

  /**
   * 댓글 수정
   * @param payload 댓글 수정 페이로드
   * @returns 성공 응답
   */
  async updateComment(
    payload: CommentCreatePayload
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.put<void>(
      COMMENT_ENDPOINTS.UPDATE_COMMENTS(),
      payload
    );
  },

  /**
   * 댓글 삭제
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로 (예: "0", "0.1", "0.1.2")
   * @returns 성공 응답
   */
  async deleteComment(
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.delete<void>(
      COMMENT_ENDPOINTS.DELETE_COMMENT(postUlid, path)
    );
  },

  /**
   * 댓글 좋아요
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로
   * @returns 성공 응답
   */
  async likeComment(
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.put<void>(
      COMMENT_ENDPOINTS.LIKE_COMMENT(postUlid, path)
    );
  },

  /**
   * 댓글 좋아요 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로
   * @returns 성공 응답
   */
  async unlikeComment(
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.delete<void>(
      COMMENT_ENDPOINTS.LIKE_COMMENT(postUlid, path)
    );
  },

  /**
   * 내 댓글 목록 조회
   * @param params 페이지네이션 파라미터
   * @returns 내 댓글 목록
   */
  async getMyComments(
    params: GetMyCommentsRequest
  ): Promise<ApiResponse<GetMyCommentsResponseData>> {
    const { page, size = 8, uuid } = params;

    if (!uuid) {
      throw new Error('uuid is required for getMyComments');
    }

    const queryString = buildQueryString({ page, size });

    return clientApiInstance.get<GetMyCommentsResponseData>(
      `${COMMENT_ENDPOINTS.MY_COMMENTS(uuid)}${queryString}`
    );
  },
};
