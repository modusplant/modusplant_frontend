'use client';

import React, { Suspense, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';
import SearchOverlay from './SearchOverlay';

export interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  placeholder?: string;
}

const SearchButton = ({
  className,
  placeholder = '검색어를 입력해 주세요',
  width,
  onClick,
  ...props
}: SearchButtonProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setIsOverlayOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          'border-border-inverse-muted shadow-search-entry flex h-9 min-w-[240px] items-center rounded-[50px] border px-4 py-2.5',
          width,
          className
        )}
        aria-label="검색 오버레이 표출"
        onClick={handleClick}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Search className="text-icon-inverse-muted h-4 w-4 shrink-0" />
          <span className="text-text-muted placeholder:text-text-muted w-full min-w-0 bg-transparent text-left text-[13px] leading-[1.2] tracking-[-0.01em] outline-none">
            {placeholder}
          </span>
        </div>
      </button>
      <Suspense fallback={null}>
        <SearchOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
        />
      </Suspense>
    </>
  );
};

export default SearchButton;
