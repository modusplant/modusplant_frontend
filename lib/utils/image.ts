/**
 * 이미지 URL을 full URL로 변환
 * @param src 이미지 소스 경로
 * @returns full URL
 */
export function getFullImageUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;

  // URL이 이미 full URL인지 확인 (http:// 또는 https://로 시작)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // full URL이 아닌 경우 prefix 추가
  const hostname = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME;
  const path = process.env.NEXT_PUBLIC_IMAGE_PATH || '';

  if (hostname) {
    return `https://${hostname}${path}${src}`;
  }

  return src;
}

/**
 * 이미지 URL을 프록시 경로로 변환 (CORS 회피용)
 * @param src 이미지 소스 경로
 * @returns 프록시 경로
 */
export function getProxiedImageUrl(
  src: string | undefined
): string | undefined {
  if (!src) return undefined;

  // 이미 프록시 URL인 경우 그대로 반환
  if (src.startsWith('/api/image-proxy')) {
    return src;
  }

  // full URL을 먼저 가져옴
  const fullUrl = getFullImageUrl(src);
  if (!fullUrl) return undefined;

  // API Route를 통한 프록시 경로로 변환
  // URL 전체를 쿼리 파라미터로 전달 (presigned URL의 쿼리 파라미터 보존)
  return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
}
