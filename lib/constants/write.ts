export const MAX_TITLE_LENGTH = 60;

export const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ERROR_MSGS = {
  INVALID_TYPE:
    '지원하지 않는 파일 형식입니다. jpeg, png, jpg 파일만 업로드 가능합니다.',
  MAX_SIZE: '10MB 이하의 이미지를 등록해주세요.',
  MAX_COUNT: `최대 10장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`,
};
export type ErrorType = keyof typeof ERROR_MSGS;

export const MAXIMUM_FILE_SIZE = 10 * 1024 * 1024;

export const MAXIMUM_FILE_COUNT = 10;
