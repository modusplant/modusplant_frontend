import { ContentFilePayload, PostWritePayload } from '@/lib/types/post';
import { WriteFormData, WriteImageData } from '@/lib/schemas/writeForm';

export const MAX_TITLE_LENGTH = 60;

export const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ERROR_MSGS = {
  INVALID_TYPE:
    '지원하지 않는 파일 형식입니다. jpeg, png, jpg 파일만 업로드 가능합니다.',
  MAX_SIZE: '10MB 이하의 이미지를 등록해주세요.',
  MAX_COUNT: `최대 10장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`,
  UPLOAD_FAILED: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
  UPLOAD_IN_PROGRESS: '이미지 업로드가 완료된 후 게시할 수 있습니다.',
  LEGACY_IMAGE_UNSUPPORTED:
    '기존 이미지를 처리할 수 없습니다. 이미지를 삭제 후 다시 등록해주세요.',
};
export type ErrorType = keyof typeof ERROR_MSGS;

export const MAXIMUM_FILE_SIZE = 10 * 1024 * 1024;

export const MAXIMUM_FILE_COUNT = 10;

export const DRAFT_INVALID_MESSAGE = '임시저장 입력값이 올바르지 않습니다.';
export const DRAFT_CATEGORY_WARNING_MESSAGE =
  '카테고리 정보를 일부 불러오지 못했습니다.';

/**
 * 파일명 생성 규칙 (Presigned URL 방식)
 */
export function buildImageApiFilename(index: number, file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `image_${index}.${ext}`;
}

function extractImageFilenameIndex(filename: string): number | null {
  const match = filename.match(/^image_(\d+)\./);
  return match ? Number(match[1]) : null;
}

/**
 * 프로필 이미지 전용 파일명 생성 — 매번 고유한 값을 부여해 CDN/Next.js 이미지 캐시가
 * 새 이미지로 갱신되지 않는 문제를 방지한다. 프로필은 `/member/{userId}/profile/{filename}`
 * 고정 경로를 덮어쓰는 구조라(`extractFileKeyFromImageUrl` 참고) 파일명이 고정되면
 * S3 키/URL도 고정되고 캐시가 절대 안 바뀐다.
 *
 * ⚠️ 프로필처럼 "고정 경로를 덮어쓰는" 업로드에만 사용할 것. 매 제출마다 서버가
 * 새 fileKey/경로를 발급하는 업로드(예: 건의/버그 제보)에는 캐시 고착 문제가 없고,
 * 오히려 백엔드가 파일명 포맷(`image_{index}.ext`)을 엄격히 검증해 400을 반환할 수 있다.
 */
export function buildProfileImageFilename(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `image_${Date.now()}.${ext}`;
}

/**
 * 신규로 추가되는 파일들에 API 규칙에 맞는 파일명을 부여한다.
 * 남아있는 이미지들의 filename에서 이미 쓰인 인덱스를 파악해 겹치지 않는
 * 가장 작은 인덱스부터 채운다 (삭제 후 재추가 시 인덱스 재사용으로 인한
 * filename 충돌 방지).
 */
export function assignNewImageFilenames(
  currentImages: { filename?: string }[],
  files: File[]
): string[] {
  const usedIndices = new Set(
    currentImages
      .map((image) =>
        image.filename ? extractImageFilenameIndex(image.filename) : null
      )
      .filter((index): index is number => index !== null)
  );

  let nextIndex = 0;
  return files.map((file) => {
    while (usedIndices.has(nextIndex)) nextIndex++;
    usedIndices.add(nextIndex);
    return buildImageApiFilename(nextIndex++, file);
  });
}

/**
 * WriteFormData를 게시글 작성/수정 요청 payload로 변환한다.
 */
export function buildWritePayload({
  data,
  isPublished,
}: {
  data: WriteFormData;
  isPublished: boolean;
}): PostWritePayload {
  // 업로드가 완료되어 fileKey/filename을 모두 가진 이미지만 제출 대상
  const uploadedImages = data.images.filter(
    (image): image is typeof image & { filename: string; fileKey: string } =>
      !!image.filename && !!image.fileKey
  );

  const contentFiles: ContentFilePayload[] = uploadedImages.map(
    (image, index) => ({
      order: index + 1,
      filename: image.filename,
      fileKey: image.fileKey,
    })
  );

  const thumbnailFilename = uploadedImages.find(
    ({ isThumbnail }) => isThumbnail
  )?.filename;

  return {
    primaryCategoryId: data.primaryCategoryId,
    secondaryCategoryId: data.secondaryCategoryId,
    title: data.title,
    contentText: data.textContent,
    contentFiles,
    thumbnailFilename,
    isPublished,
  };
}

/**
 * 이미지 업로드 상태 검증 (진행 중/실패한 이미지가 있으면 제출 차단)
 */
export function validateImagesForSubmit(
  images: WriteImageData[],
  onError: (description: string) => void
): boolean {
  if (images.some((image) => image.status === 'uploading')) {
    onError(ERROR_MSGS.UPLOAD_IN_PROGRESS);
    return false;
  }

  if (images.some((image) => image.status === 'error')) {
    onError(ERROR_MSGS.UPLOAD_FAILED);
    return false;
  }

  // 편집 조회 API가 fileKey를 내려주지 못한 레거시 이미지 등 done 상태인데
  // fileKey가 없는 이미지는 buildWritePayload에서 조용히 누락되므로 차단한다.
  if (images.some((image) => image.status === 'done' && !image.fileKey)) {
    onError(ERROR_MSGS.LEGACY_IMAGE_UNSUPPORTED);
    return false;
  }

  return true;
}
