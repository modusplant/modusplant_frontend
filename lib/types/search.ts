/**
 * 검색 기록 조회 응답 데이터
 */
export interface GetSearchHistoryResponseData {
  status: number;
  code: string;
  message: string;
  data: string[];
}
