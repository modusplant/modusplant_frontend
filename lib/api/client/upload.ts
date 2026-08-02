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
    throw new Error(`S3 업로드 실패 (status: ${response.status})`);
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
 * 아무도 참조하지 않는 orphan으로 남는다. 그래서 PUT 실패 시에는 이미 발급받은
 * 같은 presigned URL로만 재시도한다.
 */
export async function uploadImageFile(
  file: File,
  filename: string,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string }> {
  const issue = () =>
    issuePresignedUrls(
      [{ filename, contentType: file.type }],
      signal
    ).then(([issued]) => issued);

  let issued;
  try {
    issued = await issue();
  } catch (error) {
    if (signal?.aborted) throw error;
    issued = await issue();
  }

  try {
    await uploadFileToS3(issued.uploadUrl, file, signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    await uploadFileToS3(issued.uploadUrl, file, signal);
  }

  return { fileKey: issued.fileKey, filename: issued.filename };
}
