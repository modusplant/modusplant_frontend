import { POST_ENDPOINTS } from '@/lib/constants/endpoints';
import { clientApiInstance } from '../instances/clientInstance';

interface PresignedUrlRequestItem {
  filename: string;
  contentType: string;
}

interface PresignedUrlResponseItem {
  filename: string;
  uploadUrl: string;
  fileKey: string;
}

/**
 * Presigned URL 발급 요청
 */
export async function issuePresignedUrls(
  items: PresignedUrlRequestItem[],
  signal?: AbortSignal
): Promise<PresignedUrlResponseItem[]> {
  const res = await clientApiInstance.post<PresignedUrlResponseItem[]>(
    POST_ENDPOINTS.UPLOAD_IMAGE_URL,
    items,
    { signal }
  );
  if (!res.data) {
    throw new Error('Presigned URL 발급 응답이 비어있습니다.');
  }
  return res.data;
}

/**
 * S3(Wasabi) PUT 실패 시 상태 코드를 담아 던지는 에러.
 * 서명 만료로 보이는 실패(403)를 다른 실패와 구분하는 데 사용한다.
 */
export class S3UploadError extends Error {
  constructor(public readonly status: number) {
    super(`S3 업로드 실패 (status: ${status})`);
    this.name = 'S3UploadError';
  }
}

// S3(Wasabi)가 presigned URL 서명 만료/불일치 시 응답하는 상태 코드.
// 이 상태일 때만 presigned URL을 재발급받아 재시도한다.
const S3_SIGNATURE_ERROR_STATUS = 403;

function isLikelyExpiredSignatureError(error: unknown): boolean {
  return (
    error instanceof S3UploadError && error.status === S3_SIGNATURE_ERROR_STATUS
  );
}

/**
 * S3(Wasabi)에 파일 직접 PUT 업로드
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
  signal?: AbortSignal
) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
    signal,
  });

  if (!response.ok) {
    throw new S3UploadError(response.status);
  }
}

/**
 * 파일 하나를 발급 + S3 PUT까지 한 번에 수행
 * 발급/PUT 실패 시 가이드 문서 정책에 따라 1회 재시도
 * (단, 사용자가 이미지를 삭제해 취소된 경우는 재시도하지 않음)
 *
 * 발급과 PUT의 재시도는 서로 독립적으로 처리한다: PUT만 실패했을 때 발급부터
 * 다시 하면 새 fileKey가 나오는데, 만약 첫 PUT이 실제로는 S3에 성공적으로
 * 저장됐지만 응답만 못 받은 경우(네트워크 단절 등) 첫 fileKey의 오브젝트가
 * 아무도 참조하지 않는 orphan으로 남는다. 그래서 PUT 실패 시에는 우선 이미
 * 발급받은 같은 presigned URL로 재시도하고, 그마저 서명 만료로 보이는 에러
 * (403)로 실패한 경우에만 마지막으로 presigned URL을 재발급받아 재시도한다.
 */

// 발급(issue) 방식과 무관하게 동일하게 적용되는 재시도/orphan 방지 정책.
// (정책 설명은 기존 uploadImageFile 주석과 동일 — 그대로 이전)
interface IssuedUpload {
  uploadUrl: string;
  fileKey: string;
  filename: string;
}

export async function uploadWithRetry(
  issue: () => Promise<IssuedUpload>,
  file: File,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string }> {
  const put = (uploadUrl: string) => uploadFileToS3(uploadUrl, file, signal);

  let issued: IssuedUpload;
  try {
    issued = await issue();
  } catch (error) {
    if (signal?.aborted) throw error;
    issued = await issue();
  }

  try {
    await put(issued.uploadUrl);
    return { fileKey: issued.fileKey, filename: issued.filename };
  } catch (error) {
    if (signal?.aborted) throw error;
  }

  try {
    await put(issued.uploadUrl);
    return { fileKey: issued.fileKey, filename: issued.filename };
  } catch (error) {
    if (signal?.aborted) throw error;
    if (!isLikelyExpiredSignatureError(error)) throw error;
  }

  issued = await issue();
  await put(issued.uploadUrl);
  return { fileKey: issued.fileKey, filename: issued.filename };
}

// 게시글 업로드 — 기존과 동일하게 동작 (외부 시그니처/동작 불변)
export async function uploadImageFile(
  file: File,
  filename: string,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string }> {
  return uploadWithRetry(
    () =>
      issuePresignedUrls([{ filename, contentType: file.type }], signal).then(
        ([issued]) => issued
      ),
    file,
    signal
  );
}
