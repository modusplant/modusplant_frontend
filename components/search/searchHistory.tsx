import React from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

export interface SearchHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SearchHistory = ({ children, className, ...props }: SearchHistoryProps) => {
  return (
    <div
      className={cn(
        'flex h-[34px] items-center gap-2 rounded-[7px] px-2 py-[7px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default SearchHistory;
