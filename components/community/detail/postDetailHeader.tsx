'use client';

import Badge from '@/components/_common/badge';
import { formatRelativeTime } from '@/lib/utils/formatTime';
import ProfileImage from '@/components/_common/profileImage';

interface PostDetailHeaderProps {
  secondaryCategory: string;
  title: string;
  authorImageUrl: string | null;
  nickname: string;
  publishedAt: string;
  viewCount: number;
  isUpdated?: boolean;
}

export default function PostDetailHeader({
  secondaryCategory,
  title,
  authorImageUrl,
  nickname,
  publishedAt,
  viewCount,
  isUpdated,
}: PostDetailHeaderProps) {
  return (
    <div>
      {/* 카테고리 배지 */}
      <div>
        <Badge variant="default" size="md" className="my-4">
          {secondaryCategory}
        </Badge>
      </div>

      {/* 제목 */}
      <h1 className="text-neutral-10 mb-2 text-[22px] leading-tight font-bold md:text-[28px]">
        {title}
      </h1>

      {/* 작성자 정보 */}
      <div className="text-neutral-70 mb-8 flex items-center gap-2 text-[13px]">
        {/* 작성자 */}
        <div className="relative h-6 w-6 overflow-hidden rounded-full">
          <ProfileImage imageSrc={authorImageUrl} />
        </div>
        <span className="text-neutral-20 text-[15px] font-semibold">
          {nickname}
        </span>

        {/* 작성일 */}
        <span className="">{formatRelativeTime(publishedAt)}</span>
        <span>·</span>
        {/* 조회수 */}
        <span>조회 {viewCount.toLocaleString()}</span>
        {isUpdated && (
          <>
            <span>·</span>
            <span>수정됨</span>
          </>
        )}
      </div>
    </div>
  );
}
