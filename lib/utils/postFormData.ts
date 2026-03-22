/**
 * 게시글 FormData 변환 헬퍼 함수
 * 작성과 수정에서 공통으로 사용하는 FormData 생성 로직
 */

import { getProxiedImageUrl } from './image';

export interface PostFormDataPayload {
  textContent: string;
  images: (File | string)[]; // File 또는 기존 이미지 URL
  primaryCategoryId: string;
  secondaryCategoryId: string;
  title: string;
}

/**
 * 게시글 작성/수정 시 FormData 생성
 * @param payload 게시글 데이터
 * @returns 서버에 전송할 FormData
 */
export async function buildPostFormData(
  payload: PostFormDataPayload
): Promise<FormData> {
  const formData = new FormData();

  // 1. 텍스트 콘텐츠를 파일로 변환하여 추가
  if (payload.textContent.trim()) {
    const textBlob = new Blob([payload.textContent], { type: 'text/plain' });
    const textFile = new File([textBlob], 'text_0.txt', {
      type: 'text/plain',
    });
    formData.append('content', textFile);
  }

  // 2. 이미지 처리 (File 객체와 URL 모두 동일하게 처리)
  const imageFiles: File[] = [];

  for (const image of payload.images) {
    if (image instanceof File) {
      imageFiles.push(image);
      formData.append('content', image);
    } else if (typeof image === 'string') {
      // URL을 Blob으로 변환하여 File 객체로 생성
      try {
        // 프록시 경로로 변환 (CORS 회피)
        const proxiedUrl = getProxiedImageUrl(image) || image;
        const response = await fetch(proxiedUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();

        const filename = image.split('/').pop()?.split('?')[0] || 'image';
        const file = new File([blob], filename, { type: blob.type });

        imageFiles.push(file);
        formData.append('content', file);
      } catch (error) {
        console.error('FormData 변환 중 이미지 로드 실패');
      }
    }
  }

  // 3. orderInfo 생성 (텍스트 + 이미지 순서)
  const orderInfo: { filename: string; order: number }[] = [];
  let currentOrder = 1;

  if (payload.textContent.trim()) {
    orderInfo.push({ filename: 'text_0.txt', order: currentOrder++ });
  }

  imageFiles.forEach((image) => {
    orderInfo.push({ filename: image.name, order: currentOrder++ });
  });

  const orderBlob = new Blob([JSON.stringify(orderInfo)], {
    type: 'application/json',
  });
  formData.append('orderInfo', orderBlob);

  return formData;
}

/**
 * 게시글 작성/수정 시 쿼리 파라미터 생성
 * @param payload 게시글 데이터
 * @returns 쿼리 파라미터 문자열
 */
export function buildPostQueryParams(payload: PostFormDataPayload): string {
  const params = new URLSearchParams({
    primaryCategoryId: payload.primaryCategoryId,
    secondaryCategoryId: payload.secondaryCategoryId,
    title: payload.title,
    isPublished: 'true',
  });

  return params.toString();
}
