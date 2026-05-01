/**
 * 검색 옵션 필터
 */
export type SearchOption =
  | 'title'
  | 'content'
  | 'title_content'
  | 'title_content_comment';

/**
 * 검색 정렬 조건
 */
export type SearchSort = 'latest' | 'relevance';

/**
 * 검색 요청 파라미터
 */
export interface SearchRequest {
  size: number;
  lastPostId?: string;
  lastPostImportance?: number;
  lastPostSimilarity?: number;
  lastPostPublishedAt?: string;
  option: SearchOption;
  keyword: string;
  sort: SearchSort;
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
}

/**
 * 검색 기록 조회 응답 데이터
 */
export type GetSearchHistoryResponseData = string[];
