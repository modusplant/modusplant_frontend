import { MEMBER_ENDPOINTS, buildQueryString } from '@/lib/constants/endpoints';
import { clientApiInstance } from '../instances/clientInstance';
import { uploadWithRetry } from './upload';

interface ReportFileKeyResponse {
  reportId: string;
  imagePrepareResponse: { fileKey: string; storageUrl: string }[];
}

/**
 * 건의/버그 제보 이미지용 presigned URL 발급
 */
export async function issueReportFileKey(
  filename: string,
  contentType: string,
  signal?: AbortSignal
): Promise<ReportFileKeyResponse> {
  const queryString = buildQueryString({
    filenames: [filename],
    contentTypes: [contentType],
  });

  const res = await clientApiInstance.post<ReportFileKeyResponse>(
    `${MEMBER_ENDPOINTS.ISSUE_BUG_REPORT_FILE_KEY}${queryString}`,
    undefined,
    { signal }
  );
  if (!res.data) {
    throw new Error('제보 이미지 파일 키 발급 응답이 비어있습니다.');
  }
  return res.data;
}

/**
 * 제보 이미지 하나를 발급 + S3 PUT까지 수행 (게시글 업로드와 동일한 재시도 정책 재사용)
 */
export async function uploadReportImage(
  file: File,
  filename: string,
  signal?: AbortSignal
): Promise<{ fileKey: string; filename: string; reportId: string }> {
  let reportId = '';

  const uploaded = await uploadWithRetry(
    () =>
      issueReportFileKey(filename, file.type, signal).then((issued) => {
        reportId = issued.reportId;
        const [prepared] = issued.imagePrepareResponse;
        return {
          uploadUrl: prepared.storageUrl,
          fileKey: prepared.fileKey,
          filename,
        };
      }),
    file,
    signal
  );

  return { ...uploaded, reportId };
}
