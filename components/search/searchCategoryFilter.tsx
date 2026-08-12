'use client';

import PrimaryCategoryFilter from '@/components/_common/primaryCategoryFilter';
import SecondaryCategoryFilter from '@/components/_common/secondaryCategoryFilter';

interface SearchCategoryFilterProps {
  primaryCategoryId: string;
  secondaryCategoryIds: string[];
  onPrimaryCategoryChange: (categoryId: string) => void;
  onSecondaryCategoriesChange: (categoryIds: string[]) => void;
}

const SearchCategoryFilter = ({
  primaryCategoryId,
  secondaryCategoryIds,
  onPrimaryCategoryChange,
  onSecondaryCategoriesChange,
}: SearchCategoryFilterProps) => {
  // 검색 화면에서는 게시글 작성 폼 컨텍스트 없이 카테고리 필터 UI만 재사용한다.
  return (
    <div className="mt-1.5 flex w-min gap-2.5 md:mt-0 md:flex-row md:items-center">
      <PrimaryCategoryFilter
        selectedCategoryId={primaryCategoryId}
        onCategoryChange={onPrimaryCategoryChange}
        variant="filter"
        showAll
      />

      <SecondaryCategoryFilter
        primaryCategoryId={primaryCategoryId}
        selectedCategoryIds={secondaryCategoryIds}
        onCategoriesChange={onSecondaryCategoriesChange}
        variant="filter"
        multiSelect
        showAll
        disableAutoReset
      />
    </div>
  );
};

export default SearchCategoryFilter;
