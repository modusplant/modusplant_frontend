/**
 * 게시글 FormData 변환 헬퍼 함수
 * 작성과 수정에서 공통으로 사용하는 FormData 생성 로직
 */

import { PostWritePayload } from '../types/post';
import { getProxiedImageUrl } from './image';

export interface PostFormDataPayload {
  textContent: string;
  images: (File | string)[]; // File 또는 기존 이미지 URL
  primaryCategoryId: string;
  secondaryCategoryId: string;
  title: string;
}

interface BuildPostFormDataOptions {
  isDraft?: boolean;
}

/**
 * 게시글 작성/수정 시 FormData 생성
 * @param payload 게시글 데이터
 * @returns 서버에 전송할 FormData
 */
export async function buildPostFormData(
  payload: PostFormDataPayload,
  options?: BuildPostFormDataOptions
) {
  const { textContent, images } = payload;
  const hasTextContent = !!textContent.trim();
  const isDraft = options?.isDraft ?? false;

  const formData = new FormData();

  // 1. 텍스트 콘텐츠를 파일로 변환하여 추가
  if (hasTextContent) {
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textFile = new File([textBlob], 'text_0.txt', { type: 'text/plain' });
    formData.append('content', textFile);
  }

  // URL에서 이미지를 가져와 File 객체로 변환하는 헬퍼 함수
  const _getImageFileFromUrl = async (url: string) => {
    try {
      const proxiedUrl = getProxiedImageUrl(url) || url;
      const response = await fetch(proxiedUrl);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const blob = await response.blob();
      const filename = url.split('/').pop()?.split('?')[0] || 'image';
      const file = new File([blob], filename, { type: blob.type });

      return file;
    } catch (error) {
      console.error(`이미지 URL 처리 실패: ${url}`, error);
      return null;
    }
  };

  // 2. 이미지 처리 (File 객체와 URL 모두 동일하게 처리)
  let imageFiles: File[] = [];
  const canIncludeContent = !isDraft || hasTextContent;
  if (canIncludeContent) {
    const imagesToProcess = images.map(async (image) => {
      if (image instanceof File) return image;
      if (typeof image === 'string') return await _getImageFileFromUrl(image);
      return null;
    });
    const fileList = await Promise.all(imagesToProcess);
    imageFiles = fileList.filter((file): file is File => file !== null);
    imageFiles.forEach((image) => formData.append('content', image));
  }

  // 3. orderInfo 생성 (텍스트 + 이미지 순서)
  if (canIncludeContent) {
    const orderInfo = [
      ...(hasTextContent ? ['text_0.txt'] : []),
      ...imageFiles.map(({ name }) => name),
    ].map((filename, idx) => ({ filename, order: idx + 1 }));
    const orderInfoStr = JSON.stringify(orderInfo);
    const orderBlob = new Blob([orderInfoStr], { type: 'application/json' });
    formData.append('orderInfo', orderBlob);
  }

  return formData;
}

interface BuildPostQueryParamsOptions {
  omitEmptyString?: boolean;
}

/**
 * 게시글 작성/수정 시 쿼리 파라미터 생성
 * @param payload 게시글 데이터
 * @returns 쿼리 파라미터 문자열
 */
export function buildPostQueryParams(
  payload: PostWritePayload,
  options?: BuildPostQueryParamsOptions
) {
  const params = new URLSearchParams();
  const { omitEmptyString = false } = options ?? {};

  const _appendParam = (key: string, value?: string) => {
    if (value === undefined) return;
    if (omitEmptyString && value === '') return;
    params.append(key, value);
  };

  _appendParam('title', payload.title);
  _appendParam('primaryCategoryId', payload.primaryCategoryId);
  _appendParam('secondaryCategoryId', payload.secondaryCategoryId);
  _appendParam('isPublished', String(payload.isPublished));
  _appendParam('thumbnailFilename', payload.thumbnailFilename);

  return params.toString();
}
