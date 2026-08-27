import { MEMBER_ENDPOINTS, buildQueryString } from '@/lib/constants/endpoints';
import { clientApiInstance } from '../instances/clientInstance';
import { uploadWithRetry } from './upload';

interface ProfileFileKeyResponse {
  fileKey: string;
  storageUrl: string;
}

/**
 * 프로필 이미지 URL에서 fileKey(스토리지 오브젝트 키)를 추출
 * URL 구조: https://{host}/{bucket}/member/{userId}/profile/{filename}
 */
export function extractFileKeyFromImageUrl(
  imageUrl: string | null | undefined
): string | undefined {
  if (!imageUrl) return undefined;
  const index = imageUrl.indexOf('/member/');
  return index === -1 ? undefined : imageUrl.slice(index + 1);
}

/**
 * 프로필 이미지용 presigned URL 발급
 */
async function issueProfileFileKey(
  filename: string,
  contentType: string,
  signal?: AbortSignal
): Promise<ProfileFileKeyResponse> {
  const queryString = buildQueryString({
    filename,
    contentType,
  });

  const res = await clientApiInstance.post<ProfileFileKeyResponse>(
    `${MEMBER_ENDPOINTS.ISSUE_PROFILE_FILE_KEY}${queryString}`,
    undefined,
    { signal }
  );
  if (!res.data) {
    throw new Error('프로필 이미지 파일 키 발급 응답이 비어있습니다.');
  }
  return res.data;
}

/**
 * 프로필 이미지 하나를 발급 + S3 PUT까지 수행 (게시글 업로드와 동일한 재시도 정책 재사용)
 */
export async function uploadProfileImage(
  file: File,
  filename: string,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string }> {
  return uploadWithRetry(
    () =>
      issueProfileFileKey(filename, file.type, signal).then((issued) => ({
        uploadUrl: issued.storageUrl,
        fileKey: issued.fileKey,
        filename,
      })),
    file,
    signal
  );
}
