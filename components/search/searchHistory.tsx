import React from 'react';
import { cn } from '@/lib/utils/tailwindHelper';
import { History } from 'lucide-react';

export interface SearchHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string[];
}

const SearchHistory = ({ data, className, ...props }: SearchHistoryProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {data.map((keyword) => (
        <div
          key={keyword}
          className="flex w-full items-center gap-2 rounded-[7px] px-2 py-[7px] hover:cursor-pointer hover:bg-[#F3F4F5]"
        >
          <History className="text-neutral-40 h-5 w-5" />
          <button
            type="button"
            className="text-neutral-20 px-2 text-left text-[15px] leading-[1.2] font-medium tracking-[-0.01em]"
          >
            {keyword}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchHistory;
