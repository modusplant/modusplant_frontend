import { describe, expect, it } from 'vitest';
import { buildImageApiFilename } from '@/lib/constants/write';

describe('buildImageApiFilename', () => {
  it('파일 확장자를 소문자로 변환해 붙인다', () => {
    const file = new File(['content'], 'photo.JPG', { type: 'image/jpeg' });
    expect(buildImageApiFilename(0, file)).toBe('image_0.jpg');
  });

  it('점(.)이 없는 파일명은 전체 이름을 확장자처럼 그대로 붙인다', () => {
    // NOTE: split('.').pop()은 점이 없으면 원본 문자열을 그대로 반환하므로
    // 'jpg' 폴백은 실제로 타지 않는다 (확인된 엣지케이스, 별도 이슈로 다룰 예정)
    const file = new File(['content'], 'photo', { type: 'image/jpeg' });
    expect(buildImageApiFilename(2, file)).toBe('image_2.photo');
  });

  it('index를 그대로 파일명에 반영한다', () => {
    const file = new File(['content'], 'a.png', { type: 'image/png' });
    expect(buildImageApiFilename(7, file)).toBe('image_7.png');
  });
});
