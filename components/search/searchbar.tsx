'use client';

import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';

export interface SearchBarProps extends React.ComponentPropsWithRef<'input'> {
  className?: string;
  placeholder?: string;
  width?: string;
}

const SearchBar = ({
  className,
  placeholder = '검색어를 입력해 주세요',
  ref,
  width,
  ...props
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const setInputRef = (input: HTMLInputElement | null) => {
    inputRef.current = input;

    if (typeof ref === 'function') {
      ref(input);
      return;
    }

    if (ref) {
      ref.current = input;
    }
  };

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;
    input.value = '';
    input.focus();
  };

  return (
    <label
      className={cn(
        'border-surface-stroke focus-within:border-primary-50 flex h-[49px] w-full min-w-[240px] items-center justify-between rounded-[50px] border px-4 py-[15px]',
        width,
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <Search className="text-neutral-20 h-4 w-4 shrink-0" />
        <input
          ref={setInputRef}
          type="text"
          placeholder={placeholder}
          className="text-neutral-20 placeholder:text-neutral-70 w-full min-w-0 bg-transparent text-[16px] leading-[1.2] tracking-[-0.01em] outline-none"
          {...props}
        />
      </div>
      <button
        type="button"
        className="bg-neutral-60 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        onClick={handleClear}
        aria-label="검색어 지우기"
      >
        <X className="h-3 w-3 text-white" />
      </button>
    </label>
  );
};

export default SearchBar;
