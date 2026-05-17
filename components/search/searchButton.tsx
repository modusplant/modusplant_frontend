'use client';

import React, { Suspense, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';
import SearchOverlay from './SearchOverlay';

export interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  placeholder?: string;
  isRootPath?: boolean;
  scrolled?: boolean;
}

const SearchButton = ({
  className,
  placeholder = '검색어를 입력해 주세요',
  width,
  isRootPath,
  scrolled,
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
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0 md:h-9 md:w-auto md:min-w-[240px] md:justify-start md:rounded-[50px] md:border md:border-[#FFFFFF4D] md:px-4 md:py-2.5 md:shadow-[2px_2px_8px_0px_#1C4A3626]',
          width,
          className
        )}
        aria-label="검색 오버레이 표출"
        onClick={handleClick}
        {...props}
      >
        <div className="flex min-w-0 items-center justify-center md:flex-1 md:justify-start md:gap-2.5">
          <Search
            className="text-neutral-90 h-6 w-6 shrink-0 md:h-4 md:w-4"
            color={scrolled || !isRootPath ? 'black' : 'white'}
          />
          <span className="text-neutral-60 placeholder:text-neutral-60 hidden w-full min-w-0 bg-transparent text-left text-[13px] leading-[1.2] tracking-[-0.01em] outline-none md:block">
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
