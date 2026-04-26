import { clientApiInstance } from '@/lib/api/instances/clientInstance';
import { SEARCH_ENDPOINTS } from '@/lib/constants/endpoints';
import { ApiResponse } from '@/lib/types/common';
import { GetSearchHistoryResponseData } from '@/lib/types/search';

/**
 * 검색 API
 */
export const searchApi = {
  /**
   * 검색 기록 조회
   */
  async getSearchHistory(): Promise<ApiResponse<GetSearchHistoryResponseData>> {
    return clientApiInstance.get<GetSearchHistoryResponseData>(
      SEARCH_ENDPOINTS.GET_SEARCH_HISTORY()
    );
  },
};
