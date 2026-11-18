/**
 * 저장된 이미지 경로를 브라우저에서 표시할 URL로 변환
 */
export function getDisplayImageUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;

  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('/api/image-proxy') ||
    src.startsWith('/image-proxy/')
  ) {
    return src;
  }

  return `/image-proxy/${encodeURIComponent(src)}`;
}

/**
 * 이미지 URL을 프록시 경로로 변환 (CORS 회피용)
 * @param src 이미지 소스 경로
 * @returns 프록시 경로
 */
export function getProxiedImageUrl(
  src: string | undefined
): string | undefined {
  const url = getDisplayImageUrl(src);
  if (!url || url.startsWith('/')) return url;

  // presigned URL의 쿼리 파라미터 보존
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function createUuid() {
  return typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
