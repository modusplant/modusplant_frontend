/**
 * API 베이스 경로
 */
const API_V1 = '/api/v1';

/**
 * 인증 관련 엔드포인트
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `/api/auth/login`,
  KAKAO_LOGIN: `/api/v1/auth/social-login/kakao`,
  SOCIAL_SIGNUP: `/api/v1/auth/social-signup`,
  SIGNUP: `/api/members/register`,
  TOKEN_REFRESH: `/api/auth/token/refresh`,
  CHECK_NICKNAME: (nickname: string) =>
    `${API_V1}/members/check/nickname/${encodeURIComponent(nickname)}`,

  RESET_PASSWORD_CODE_SEND: `/api/auth/reset-password-request/send`,
  RESET_PASSWORD_VERIFY_CODE: (uuid: string) =>
    `/api/auth/reset-password-request/verify/email?uuid=${uuid}`,
  RESET_PASSWORD: `/api/auth/reset-password-request/verify/input`,

  VERIFY_EMAIL_CODE: `/api/members/verify-email`,
  VERIFY_EMAIL_CODE_SEND: `/api/members/verify-email/send`,
  CHANGE_EMAIL: (userId: string) => `${API_V1}/members/${userId}/modify/email`,
} as const;

/**
 * 회원 관련 엔드포인트
 */
export const MEMBER_ENDPOINTS = {
  PROFILE: (userId: string) => `${API_V1}/members/${userId}/profile`,
  AUTH_INFO: (userId: string) => `${API_V1}/members/${userId}/auth-info`,

  // 마이페이지
  MY_RECENT_POSTS: `${API_V1}/communication/posts/me/history`,
  MY_POSTS: `${API_V1}/communication/posts/me`,
  MY_LIKED_POSTS: `${API_V1}/communication/posts/me/likes`,
  MY_BOOKMARKED_POSTS: `${API_V1}/communication/posts/me/bookmarks`,
  MY_BUG_REPORTS: `${API_V1}/report/proposal-or-bug`,
} as const;

/**
 * 게시글 관련 엔드포인트
 */
export const POST_ENDPOINTS = {
  // 기본 CRUD
  POSTS: `${API_V1}/communication/posts`,
  MY_DRAFTS: `${API_V1}/communication/posts/me/drafts`,
  POST_DETAIL: (postId: string) => `${API_V1}/communication/posts/${postId}`,
  POST_DETAIL_EDIT: (postId: string) =>
    `${API_V1}/communication/posts/${postId}/data`,

  LIKE_POST: (memberId: string, postUlid: string) =>
    `${API_V1}/members/${memberId}/like/communication/post/${postUlid}`,
  BOOKMARK_POST: (memberId: string, postUlid: string) =>
    `${API_V1}/members/${memberId}/bookmark/communication/post/${postUlid}`,

  // 쿼리 파라미터를 포함한 엔드포인트 빌더
  withQueryParams: (
    baseEndpoint: string,
    params: Record<string, string | number | boolean | undefined>
  ) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
  },
} as const;

/**
 * 댓글 관련 엔드포인트
 */
export const COMMENT_ENDPOINTS = {
  COMMENTS: `${API_V1}/communication/comments`,
  POST_COMMENTS: (postId: string) =>
    `${API_V1}/communication/comments/post/${postId}`,
  UPDATE_COMMENTS: () => `${API_V1}/communication/comments/update`,
  DELETE_COMMENT: (postUlid: string, path: string) =>
    `${API_V1}/communication/comments/post/${postUlid}/path/${path}`,
  LIKE_COMMENT: (memberId: string, postUlid: string, path: string) =>
    `${API_V1}/members/${memberId}/like/communication/post/${postUlid}/path/${path}`,
  MY_COMMENTS: (uuid: string) =>
    `${API_V1}/communication/comments/member/auth/${uuid}`,
} as const;

/**
 * 알림 관련 엔드포인트
 */
export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: () => `${API_V1}/notifications`,
  READ_ONE_NOTIFICATION: (id: string) => `${API_V1}/notifications/${id}/read`,
  READ_ALL_NOTIFICATIONS: () => `${API_V1}/notifications/read-all`,
  GET_UNREAD_NOTIFICATIONS_COUNT: () => `${API_V1}/notifications/unread-count`,
};

/**
 * 타입 안전한 쿼리 파라미터 빌더
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}
