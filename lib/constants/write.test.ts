import { describe, expect, it } from 'vitest';
import {
  assignNewImageFilenames,
  buildImageApiFilename,
} from '@/lib/constants/write';

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

describe('assignNewImageFilenames', () => {
  // 버그 재현: 삭제 후 재추가 시 인덱스가 재사용되어 filename이 중복된다.
  // (image_2.jpg가 있는 상태에서 삭제/추가를 반복하면 새 이미지도 image_2.jpg를 받게 됨)
  it('이미지를 삭제하고 재추가해도 남아있는 이미지와 파일명이 중복되지 않아야 한다', () => {
    // 1) 이미지 3장 업로드: image_0.jpg, image_1.jpg, image_2.jpg
    const initialFiles = [
      new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      new File(['b'], 'b.jpg', { type: 'image/jpeg' }),
      new File(['c'], 'c.jpg', { type: 'image/jpeg' }),
    ];
    const initialFilenames = assignNewImageFilenames([], initialFiles);

    // 2) 2번째(image_1.jpg) 삭제 → image_0.jpg, image_2.jpg만 남음
    const survivors = [
      { filename: initialFilenames[0] },
      { filename: initialFilenames[2] },
    ];

    // 3) 새 이미지 1장 추가
    const newFile = new File(['d'], 'd.jpg', { type: 'image/jpeg' });
    const [newFilename] = assignNewImageFilenames(survivors, [newFile]);

    const survivorFilenames = survivors.map((image) => image.filename);
    expect(survivorFilenames).not.toContain(newFilename);
  });

  it('여러 장을 한 번에 추가할 때도 서로 중복되지 않는 filename을 받는다', () => {
    const survivors = [{ filename: 'image_0.jpg' }, { filename: 'image_2.jpg' }];
    const files = [
      new File(['d'], 'd.jpg', { type: 'image/jpeg' }),
      new File(['e'], 'e.jpg', { type: 'image/jpeg' }),
    ];

    const newFilenames = assignNewImageFilenames(survivors, files);

    expect(new Set(newFilenames).size).toBe(newFilenames.length);
    newFilenames.forEach((filename) => {
      expect(survivors.map((image) => image.filename)).not.toContain(filename);
    });
  });

  it('겹치는 이미지가 없으면 0번부터 순서대로 채운다', () => {
    const files = [
      new File(['a'], 'a.jpg', { type: 'image/jpeg' }),
      new File(['b'], 'b.jpg', { type: 'image/jpeg' }),
    ];

    expect(assignNewImageFilenames([], files)).toEqual([
      'image_0.jpg',
      'image_1.jpg',
    ]);
  });
});
