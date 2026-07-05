'use client';

import { PostData } from '@/lib/types/post';
import Badge from '@/components/_common/badge';
import { secondaryCategoryLabels } from '@/lib/constants/categories';
import { getTextContent } from '@/lib/utils/post';

export interface PostListItemContentProps {
  post: PostData;
}

/**
 * 게시글 리스트 아이템 - 콘텐츠 영역
 * - 카테고리 배지
 * - 제목
 * - 본문 요약 (최대 2줄)
 */
export default function PostListItemContent({
  post,
}: PostListItemContentProps) {
  const excerpt = getTextContent(post.content);

  return (
    <div className="flex flex-col gap-2">
      {/* 2차 카테고리 배지 */}
      <div>
        <Badge
          variant="outline"
          size="md"
          className="bg-surface-98 -ml-1 font-medium"
        >
          {secondaryCategoryLabels[post.secondaryCategory] ||
            post.secondaryCategory}
        </Badge>
      </div>

      {/* 제목 + 본문 영역 */}
      <div className="flex flex-col gap-1.5">
        {/* 제목 */}
        <h3 className="text-neutral-20 line-clamp-1 text-[15px] leading-[1.2] font-medium tracking-[-0.01em]">
          {post.title}
        </h3>

        {/* 본문 일부 (말줄임표, 최대 2줄) */}
        {excerpt && (
          <p className="text-neutral-40 line-clamp-2 max-w-full text-sm leading-normal tracking-[-0.03em] md:max-w-2xl lg:max-w-3xl">
            {excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
