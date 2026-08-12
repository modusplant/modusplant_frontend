'use client';

import { cn } from '@/lib/utils/tailwindHelper';
import type { SearchOption } from '@/lib/types/search';

const SEARCH_OPTION_TABS: Array<{
  value: SearchOption;
  label: string;
}> = [
  { value: 'title_content_comment', label: '전체' },
  { value: 'title', label: '제목' },
  { value: 'content', label: '본문' },
  { value: 'title_content', label: '제목+본문' },
];

interface SearchOptionTabsProps {
  selectedOption: SearchOption;
  onChange: (option: SearchOption) => void;
}

const SearchOptionTabs = ({
  selectedOption,
  onChange,
}: SearchOptionTabsProps) => {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 [&::-webkit-scrollbar]:hidden">
      <div className="border-surface-stroke w-full min-w-max border-b md:w-full">
        <div role="tablist" className="flex items-center gap-0 md:gap-2.5">
          {SEARCH_OPTION_TABS.map((tab) => {
            const isSelected = selectedOption === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={cn(
                  'text-neutral-60 flex h-[46px] cursor-pointer items-center justify-center border-b-2 border-transparent px-5 py-3 text-center text-[16px] leading-[1.4] font-semibold tracking-[-0.01em] whitespace-pre-line transition-colors focus-visible:outline-none',
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
    </div>
  );
};

export default SearchOptionTabs;
