'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ContentPart } from '@/lib/types/post';
import { getTextContent, getImageContent } from '@/lib/utils/post';
import { parseTextWithLinks } from '@/lib/utils/textParser';
import ImageModal from './imageModal';

interface PostContentProps {
  content: ContentPart[];
}

/**
 * 게시글 상세 콘텐츠 컴포넌트
 * - 텍스트와 이미지 콘텐츠 렌더링(텍스트 First)
 * - 텍스트 내 URL을 감지하여 링크로 변환
 * - 이미지 클릭 시 풀스크린 모달로 확대
 */
export default function PostContent({ content }: PostContentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const textContent = getTextContent(content);
  const imageContent = getImageContent(content);

  return (
    <>
      <div className="prose prose-lg max-w-none">
        <p className="text-neutral-20 mb-4 text-[16px] leading-relaxed break-words whitespace-pre-wrap">
          {parseTextWithLinks(textContent)}
        </p>
        {imageContent.map((item, index) => {
          return (
            <Image
              key={index}
              src={item.src || ''}
              alt={item.filename || `이미지 ${index + 1}`}
              width={800}
              height={600}
              className="my-6 cursor-pointer rounded-lg"
              priority={index === 0}
              onClick={() => setSelectedImage(item.src || null)}
            />
          );
        })}
      </div>

      {/* 이미지 풀스크린 모달 */}
      {selectedImage && (
        <ImageModal
          imageData={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
