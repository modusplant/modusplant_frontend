import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜만 포맷팅 (yyyy-MM-dd)
 * @param dateString ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate("2025-11-26T14:30:00Z") // "2025-11-26"
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko });
}

/**
 * 날짜 포맷팅 헬퍼 함수
 * - 5분 이내: 방금 전
 * - 5분 초과 ~ 24시간 미만: n분 전 또는 n시간 전
 * - 1~10일 전: n일 전
 * - 11일 이후: YYYY년 MM월 DD일
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 5분 이내
  if (diffMinutes < 5) {
    return '방금 전';
  }

  // 5분 초과 ~ 1시간 미만
  if (diffHours < 1) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 1~10일 전
  if (diffDays >= 1 && diffDays <= 10) {
    return `${diffDays}일 전`;
  }

  // 11일 이후
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
