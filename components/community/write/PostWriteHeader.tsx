'use client';

import { useAuthStore } from '@/lib/store/authStore';

interface PostWriteHeaderProps {
  isEditMode: boolean;
}

export default function PostWriteHeader({ isEditMode }: PostWriteHeaderProps) {
  const { user } = useAuthStore();

  return (
    <div>
      {/* 제목 및 닉네임 */}
      <div className="flex flex-col gap-2.5">
        <h1 className="text-neutral-0 text-[28px] leading-[1.2] font-bold tracking-[-0.01em]">
          {isEditMode ? '게시글 수정' : '게시글 쓰기'}
        </h1>
        <p className="text-neutral-60 text-base leading-normal font-normal tracking-[-0.01em]">
          {user?.nickname || '사용자'}
        </p>
      </div>
    </div>
  );
}
