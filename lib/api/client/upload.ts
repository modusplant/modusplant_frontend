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
 * 발급/PUT 실패 시 가이드 문서 정책에 따라 발급부터 1회 재시도
 * (단, 사용자가 이미지를 삭제해 취소된 경우는 재시도하지 않음)
 */
export async function uploadImageFile(
  file: File,
  filename: string,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string }> {
  const attempt = async () => {
    const [issued] = await issuePresignedUrls(
      [{ filename, contentType: file.type }],
      signal
    );
    await uploadFileToS3(issued.uploadUrl, file, signal);
    return { fileKey: issued.fileKey, filename: issued.filename };
  };

  try {
    return await attempt();
  } catch (error) {
    if (signal?.aborted) throw error;
    return await attempt();
  }
}
