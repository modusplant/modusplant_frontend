import { serverApiInstance } from '../instances/serverInstance';
import { ApiResponse } from '@/lib/types/common';
import {
  GetPostsRequest,
  GetPostsResponseData,
  PostDetail,
} from '@/lib/types/post';
import { POST_ENDPOINTS, buildQueryString } from '@/lib/constants/endpoints';

/**
 * 서버 전용 게시글 API
 */
export const serverPostApi = {
  /**
   * 게시글 목록 조회 (커서 기반 페이지네이션) - 서버 컴포넌트 전용
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

    return serverApiInstance.get<GetPostsResponseData>(endpoint);
  },

  /**
   * 게시글 상세 조회 - 서버 컴포넌트 전용
   * @param postId 게시글 ID (ULID)
   * @returns 게시글 상세 정보
   */
  async getPostDetail(postId: string): Promise<ApiResponse<PostDetail>> {
    return serverApiInstance.get<PostDetail>(
      POST_ENDPOINTS.POST_DETAIL(postId)
    );
  },
};
