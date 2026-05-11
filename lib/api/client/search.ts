import { clientApiInstance } from '@/lib/api/instances/clientInstance';
import { SEARCH_ENDPOINTS } from '@/lib/constants/endpoints';
import { ApiResponse } from '@/lib/types/common';
import { GetPostsResponseData } from '@/lib/types/post';
import { GetSearchHistoryResponseData, SearchRequest } from '@/lib/types/search';

/**
 * 검색 API
 */
export const searchApi = {
  /**
   * 검색 결과 조회
   * @param params 검색 요청 파라미터
   * @returns 검색 결과 게시글 목록
   */
  async getSearchResult(
    params: SearchRequest
  ): Promise<ApiResponse<GetPostsResponseData>> {
    return clientApiInstance.get<GetPostsResponseData>(
      SEARCH_ENDPOINTS.GET_SEARCH_RESULT(params)
    );
  },

  /**
   * 검색 기록 조회
   */
  async getSearchHistory(): Promise<ApiResponse<GetSearchHistoryResponseData>> {
    return clientApiInstance.get<GetSearchHistoryResponseData>(
      SEARCH_ENDPOINTS.GET_SEARCH_HISTORY()
    );
  },
};
