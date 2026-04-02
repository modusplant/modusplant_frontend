'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { WriteFormData } from '@/app/community/write/[[...mode]]/page';
import PrimaryCategoryFilter from '@/components/_common/primaryCategoryFilter';
import SecondaryCategoryFilter from '@/components/_common/secondaryCategoryFilter';

interface CategorySelectorProps {
  isEditMode: boolean;
}

/**
 * 게시글 작성 페이지 카테고리 셀렉터
 * - 기존 PrimaryCategoryFilter와 SecondaryCategoryFilter 재사용
 * - variant="selector"로 게시글 작성용 스타일 적용
 */
const CategorySelector = ({ isEditMode }: CategorySelectorProps) => {
  const { control, setValue } = useFormContext<WriteFormData>();
  const [primaryCategoryId, secondaryCategoryId] = useWatch({
    control,
    name: ['primaryCategoryId', 'secondaryCategoryId'] as const,
  });

  const setOptions = { shouldDirty: true, shouldValidate: true };

  const handlePrimaryChange = (categoryId: string) => {
    setValue('primaryCategoryId', categoryId, setOptions);
    setValue('secondaryCategoryId', '', setOptions); // 1차 변경 시 2차 초기화
  };

  const handleSecondaryChange = (categoryIds: string[]) => {
    setValue('secondaryCategoryId', categoryIds[0] || '', setOptions);
  };

  return (
    <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
      <PrimaryCategoryFilter
        selectedCategoryId={primaryCategoryId}
        onCategoryChange={handlePrimaryChange}
        variant="selector"
        showAll={false}
      />

      <SecondaryCategoryFilter
        primaryCategoryId={primaryCategoryId}
        selectedCategoryIds={secondaryCategoryId ? [secondaryCategoryId] : []}
        onCategoriesChange={handleSecondaryChange}
        variant="selector"
        multiSelect={false}
        showAll={false}
        disableAutoReset={isEditMode}
      />
    </div>
  );
};

export default CategorySelector;
