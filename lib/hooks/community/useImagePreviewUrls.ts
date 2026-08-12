import { useEffect, useRef, useState } from 'react';
import { WriteImageData } from '@/lib/schemas/writeForm';

export const useImagePreviewUrls = (images: WriteImageData[]) => {
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(
    new Map()
  );
  const previewUrlsRef = useRef(previewUrls);

  // 렌더 단계가 아닌 커밋 이후 시점에 ref를 최신 값으로 동기화 (의존성 배열 없음 = 매 렌더 후 실행)
  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  });

  // images가 바뀔 때(추가/삭제) blob URL 캐시를 동기화한다.
  // effect로 실행되므로 Strict Mode의 "렌더 함수 이중 호출"에 영향받지 않고,
  // 커밋된 렌더에 대해서만 실행되어 고아 blob URL이 생기지 않는다.
  useEffect(() => {
    // blob URL 생성/해제라는 외부 브라우저 리소스와의 동기화이므로 setState가 필요하다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrls((prev) => {
      const next = new Map(prev);
      const currentIds = new Set(images.map((image) => image.id));

      prev.forEach((url, id) => {
        if (!currentIds.has(id)) {
          URL.revokeObjectURL(url);
          next.delete(id);
        }
      });

      images.forEach((image) => {
        if (typeof image.content !== 'string' && !next.has(image.id)) {
          next.set(image.id, URL.createObjectURL(image.content));
        }
      });

      return next;
    });
  }, [images]);

  // 언마운트 시에만 실행되는 cleanup (빈 의존성 배열)
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const getPreviewUrl = (image: WriteImageData) =>
    typeof image.content === 'string'
      ? image.content
      : (previewUrls.get(image.id) ?? '');

  return { getPreviewUrl };
};
