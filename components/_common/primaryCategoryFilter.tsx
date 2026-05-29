'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import Image from 'next/image';
import { PRIMARY_CATEGORIES, type Category } from '@/lib/constants/categories';
import { useDropdownState } from '@/lib/hooks/category/useDropdownState';
import { useId, useRef, type KeyboardEvent } from 'react';

export interface PrimaryCategoryFilterProps {
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  variant?: 'filter' | 'selector';
  showAll?: boolean;
  className?: string;
}

/**
 * 1차 카테고리 필터/셀렉터 (커스텀 드롭다운)
 * - variant="filter": 메인페이지 필터 (둥근 pill, "전체" 포함)
 * - variant="selector": 게시글 작성 셀렉터 (일반 rounded, "전체" 제외)
 */
export default function PrimaryCategoryFilter({
  selectedCategoryId,
  onCategoryChange,
  variant = 'filter',
  showAll = true,
  className,
}: PrimaryCategoryFilterProps) {
  const { isOpen, dropdownRef, toggle, open, close } = useDropdownState();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  const categories: Category[] = showAll
    ? [{ id: 'all', name: '전체' }, ...PRIMARY_CATEGORIES]
    : PRIMARY_CATEGORIES;

  const handleSelect = (category: Category) => {
    onCategoryChange(category.id);
    close();
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const focusSelectedOrEdgeOption = (edge: 'first' | 'last' = 'first') => {
    const selectedIndex = categories.findIndex(
      (category) => category.id === selectedCategoryId
    );
    const fallbackIndex = edge === 'last' ? categories.length - 1 : 0;

    requestAnimationFrame(() =>
      focusOption(selectedIndex >= 0 ? selectedIndex : fallbackIndex)
    );
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    event.preventDefault();
    open();
    focusSelectedOrEdgeOption(event.key === 'ArrowUp' ? 'last' : 'first');
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement
    );
    const lastIndex = categories.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusOption(currentIndex >= 0 ? Math.min(currentIndex + 1, lastIndex) : 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusOption(currentIndex >= 0 ? Math.max(currentIndex - 1, 0) : lastIndex);
        break;
      case 'Home':
        event.preventDefault();
        focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        focusOption(lastIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        requestAnimationFrame(() => triggerRef.current?.focus());
        break;
    }
  };

  const isSelector = variant === 'selector';
  const selectedCategory = categories.find((c) => c.id == selectedCategoryId);
  const displayText = selectedCategory?.name ?? '주제를 선택해주세요(필수)';

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block w-full md:w-auto', className)}
    >
      {/* 드롭다운 버튼 */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'border-surface-stroke flex items-center justify-between border',
          'hover:border-primary-50 focus:border-primary-50 focus:ring-primary-10 focus:ring-2 focus:outline-none',
          'cursor-pointer',
          isOpen && 'border-primary-50 ring-primary-10 ring-2',
          {
            // filter 스타일 (메인페이지)
            'text-neutral-20 h-10 w-40 rounded-full px-4 py-3 text-sm font-medium':
              !isSelector,
            // selector 스타일 (게시글 작성)
            'text-neutral-20 h-11 w-full rounded-lg px-4.5 py-3 text-[15px] leading-normal font-medium tracking-[-0.01em] md:w-60 md:px-4.5':
              isSelector,
          }
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
      >
        <span
          className={cn({
            'text-neutral-60': isSelector && !selectedCategory,
          })}
        >
          {displayText}
        </span>
        <Image
          src="/icon/arrow-down.svg"
          alt=""
          width={12}
          height={12}
          className={cn(isOpen && 'rotate-180')}
          loading="lazy"
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          id={listboxId}
          className={cn(
            'border-surface-stroke absolute z-50 mt-2 border bg-neutral-100 shadow-lg',
            {
              'rounded-lg p-1.5': !isSelector,
              'top-12 left-0 w-full rounded-lg md:w-60': isSelector,
            }
          )}
          role="listbox"
          onKeyDown={handleListboxKeyDown}
        >
          {categories.map((category, index) => (
            <button
              key={category.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              onClick={() => handleSelect(category)}
              className={cn(
                'hover:bg-surface-98 w-full text-left transition-colors',
                {
                  // filter 스타일
                  'text-neutral-0 rounded-lg px-5 py-2.5 text-sm font-medium md:px-4 md:py-3':
                    !isSelector,
                  'bg-action-tertiary-hover text-action-tertiary-fg font-semibold':
                    !isSelector && selectedCategoryId === category.id,
                  // selector 스타일
                  'text-neutral-20 px-4 py-2.5 text-[15px] leading-normal font-medium tracking-[-0.01em]':
                    isSelector,
                }
              )}
              role="option"
              aria-selected={selectedCategoryId === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
