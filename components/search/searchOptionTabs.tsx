'use client';

import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils/tailwindHelper';
import type { SearchOption } from '@/lib/types/search';

const SEARCH_OPTION_TABS: Array<{
  value: SearchOption;
  label: string;
}> = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '본문' },
  { value: 'title_content', label: '제목+본문' },
  { value: 'title_content_comment', label: '제목+본문+댓글' },
];

interface SearchOptionTabsProps {
  selectedOption: SearchOption;
  onChange: (option: SearchOption) => void;
}

const SearchOptionTabs = ({
  selectedOption,
  onChange,
}: SearchOptionTabsProps) => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = SEARCH_OPTION_TABS.findIndex(
    (tab) => tab.value === selectedOption
  );

  const moveToTab = (nextIndex: number) => {
    const tab = SEARCH_OPTION_TABS[nextIndex];
    if (!tab) return;

    onChange(tab.value);
    requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveToTab((currentIndex + 1) % SEARCH_OPTION_TABS.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveToTab(
          (currentIndex - 1 + SEARCH_OPTION_TABS.length) %
            SEARCH_OPTION_TABS.length
        );
        break;
      case 'Home':
        event.preventDefault();
        moveToTab(0);
        break;
      case 'End':
        event.preventDefault();
        moveToTab(SEARCH_OPTION_TABS.length - 1);
        break;
    }
  };

  return (
    <div className="border-surface-stroke w-full border-b">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-[10px]"
        onKeyDown={handleTablistKeyDown}
      >
        {SEARCH_OPTION_TABS.map((tab, index) => {
          const isSelected = selectedOption === tab.value;

          return (
            <button
              key={tab.value}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={cn(
                'text-neutral-60 focus-visible:ring-focus-ring flex h-[46px] cursor-pointer items-center justify-center border-b-2 border-transparent px-5 py-3 text-center text-[16px] leading-[1.4] font-semibold tracking-[-0.01em] whitespace-pre-line transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                isSelected && 'border-primary-50 text-primary-50'
              )}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchOptionTabs;
