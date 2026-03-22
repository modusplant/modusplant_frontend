import { clientApiInstance } from '../instances/clientInstance';
import { ApiResponse } from '@/lib/types/common';
import {
  GetMyPostsRequest,
  GetMyPostsResponseData,
  GetPostsRequest,
  GetPostsResponseData,
  GetRecentPostsRequest,
  GetRecentPostsResponseData,
  PostDetail,
  PostEditData,
  PostWritePayload,
} from '@/lib/types/post';
import {
  POST_ENDPOINTS,
  MEMBER_ENDPOINTS,
  buildQueryString,
} from '@/lib/constants/endpoints';
import {
  buildPostFormData,
  buildPostQueryParams,
} from '../../utils/postFormData';

/**
 * 게시글 관련 API
 */
export const postApi = {
  /**
   * 게시글 목록 조회 (커서 기반 페이지네이션)
   * @param params 조회 파라미터
   * @returns 게시글 목록 응답
   */
  async getPosts(
    params: GetPostsRequest
  ): Promise<ApiResponse<GetPostsResponseData>> {
    const queryString = buildQueryString({
      size: params.size,
      lastPostId: params.lastPostId,
      primaryCategoryId: params.primaryCategoryId,
      secondaryCategoryId: params.secondaryCategoryId,
    });

    const endpoint = `${POST_ENDPOINTS.POSTS}${queryString}`;

    return clientApiInstance.get<GetPostsResponseData>(endpoint);
  },

  /**
   * 게시글 상세 조회
   * @param postId 게시글 ID (ULID)
   * @returns 게시글 상세 정보
   */
  async getPostDetail(postId: string): Promise<ApiResponse<PostDetail>> {
    return clientApiInstance.get<PostDetail>(
      POST_ENDPOINTS.POST_DETAIL(postId)
    );
  },

  /**
   * 게시글 수정용 상세 조회
   * @param postId 게시글 ID (ULID)
   * @returns 게시글 상세 정보
   */
  async getEditPostDetail(postId: string): Promise<ApiResponse<PostEditData>> {
    return clientApiInstance.get<PostEditData>(
      POST_ENDPOINTS.POST_DETAIL_EDIT(postId)
    );
  },

  /**
   * 게시글 삭제
   * @param postId 게시글 ID (ULID)
   */
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return clientApiInstance.delete<void>(POST_ENDPOINTS.POST_DETAIL(postId));
  },

  /**
   * 게시글 좋아요
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   */
  async likePost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.put<void>(
      POST_ENDPOINTS.LIKE_POST(memberId, postUlid)
    );
  },

  /**
   * 게시글 좋아요 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   */
  async unlikePost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.delete<void>(
      POST_ENDPOINTS.LIKE_POST(memberId, postUlid)
    );
  },

  /**
   * 게시글 북마크
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   */
  async bookmarkPost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.put<void>(
      POST_ENDPOINTS.BOOKMARK_POST(memberId, postUlid)
    );
  },

  /**
   * 게시글 북마크 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   */
  async unbookmarkPost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance.delete<void>(
      POST_ENDPOINTS.BOOKMARK_POST(memberId, postUlid)
    );
  },

  /**
   * 게시글 작성
   * @param payload 게시글 작성 데이터
   */
  async createPost(payload: PostWritePayload): Promise<ApiResponse<void>> {
    const formData = await buildPostFormData(payload);
    const queryParams = buildPostQueryParams(payload);

    return clientApiInstance.post<void>(
      `${POST_ENDPOINTS.POSTS}?${queryParams}`,
      formData
    );
  },

  /**
   * 게시글 수정
   * @param postId 게시글 ID (ULID)
   * @param payload 게시글 수정 데이터
   */
  async updatePost(
    postId: string,
    payload: PostWritePayload
  ): Promise<ApiResponse<void>> {
    const formData = await buildPostFormData(payload);
    const queryParams = buildPostQueryParams(payload);
    return clientApiInstance.put<void>(
      `${POST_ENDPOINTS.POST_DETAIL(postId)}?${queryParams}`,
      formData
    );
  },
};
