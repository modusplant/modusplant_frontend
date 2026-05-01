import SearchResult from '@/components/search/searchResult';
import { SearchOption, SearchSort } from '@/lib/types/search';

type SearchPageProps = {
  searchParams: Promise<{
    size?: string | string[];
    option?: string | string[];
    keyword?: string | string[];
    sort?: string | string[];
    primaryCategoryId?: string | string[];
    secondaryCategoryId?: string | string[];
  }>;
};

const SEARCH_OPTIONS: SearchOption[] = [
  'title',
  'content',
  'title_content',
  'title_content_comment',
];
const SEARCH_SORTS: SearchSort[] = ['latest', 'relevance'];

// Next.js searchParams 값이 배열로 들어올 경우 첫 번째 값만 검색 조건으로 사용한다.
const getSearchParam = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] : value;
};

// 유효한 양의 정수가 아니면 기본 페이지 크기 10을 사용한다.
const getSearchSize = (value?: string) => {
  const parsedSize = Number(value);
  return Number.isInteger(parsedSize) && parsedSize > 0 ? parsedSize : 10;
};

// 허용된 검색 옵션만 사용하고, 잘못된 값은 제목 검색으로 보정한다.
const getSearchOption = (value?: string): SearchOption => {
  return SEARCH_OPTIONS.includes(value as SearchOption)
    ? (value as SearchOption)
    : 'title';
};

// 허용된 정렬 옵션만 사용하고, 잘못된 값은 최신순으로 보정한다.
const getSearchSort = (value?: string): SearchSort => {
  return SEARCH_SORTS.includes(value as SearchSort)
    ? (value as SearchSort)
    : 'latest';
};

// 1차 카테고리 쿼리가 없으면 공용 필터의 전체 값인 all을 사용한다.
const getPrimaryCategoryId = (value?: string) => {
  return value?.trim() || 'all';
};

// 2차 카테고리는 comma-separated 쿼리를 배열로 복원하고, 없으면 전체 선택으로 보정한다.
const getSecondaryCategoryIds = (value?: string) => {
  const categoryIds =
    value
      ?.split(',')
      .map((categoryId) => categoryId.trim())
      .filter(Boolean) ?? [];

  return categoryIds.length > 0 ? categoryIds : ['all'];
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const keyword = getSearchParam(params.keyword)?.trim() ?? '';
  const size = getSearchSize(getSearchParam(params.size));
  const option = getSearchOption(getSearchParam(params.option));
  const sort = getSearchSort(getSearchParam(params.sort));
  const primaryCategoryId = getPrimaryCategoryId(
    getSearchParam(params.primaryCategoryId)
  );
  const secondaryCategoryIds = getSecondaryCategoryIds(
    getSearchParam(params.secondaryCategoryId)
  );

  return (
    <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-5 py-10">
      {keyword ? (
        <SearchResult
          keyword={keyword}
          size={size}
          option={option}
          sort={sort}
          primaryCategoryId={primaryCategoryId}
          secondaryCategoryIds={secondaryCategoryIds}
        />
      ) : (
        <p className="text-sm text-neutral-50">검색어를 입력해 주세요.</p>
      )}
    </main>
  );
};

export default SearchPage;
