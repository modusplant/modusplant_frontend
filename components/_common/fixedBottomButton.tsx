import { cn } from '@/lib/utils/tailwindHelper';

interface FixedBottomButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 모바일에서 버튼을 하단에 고정하기 위해 생성한 래퍼입니다.
 * 사용 시 모바일 하단 여백을 반드시 추가해야 이전 콘텐츠가 버튼에 가려지지 않습니다.
 */

export default function FixedBottomButton({
  className,
  children,
}: FixedBottomButtonProps) {
  return (
    <>
      {/* 모바일에서 하단 고정 */}
      <div
        className={cn(
          'border-surface-98 fixed right-0 bottom-0 left-0 z-50 w-full border-t bg-white p-5 pt-3',
          'md:static md:border-0 md:bg-transparent md:px-0 md:pt-0',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
