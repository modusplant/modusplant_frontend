import React from 'react';
import { cn } from '@/lib/utils/tailwindHelper';
import { History } from 'lucide-react';

export interface SearchHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string[];
  onKeywordClick?: (keyword: string) => void;
}

const SearchHistory = ({
  data,
  className,
  onKeywordClick,
  ...props
}: SearchHistoryProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {data.map((keyword) => (
        <div
          key={keyword}
          className="hover:bg-surface-muted flex w-full items-center gap-2 rounded-[7px] px-2 py-[7px] hover:cursor-pointer"
          onClick={() => onKeywordClick?.(keyword)}
        >
          <History className="text-icon-subtle h-5 w-5" />
          <button
            type="button"
            className="text-text-subtle px-2 text-left text-[15px] leading-[1.2] font-medium tracking-[-0.01em]"
          >
            {keyword}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchHistory;
