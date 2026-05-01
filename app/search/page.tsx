import SearchResult from '@/components/search/searchResult';
import { SearchOption, SearchSort } from '@/lib/types/search';

type SearchPageProps = {
  searchParams: Promise<{
    size?: string | string[];
    option?: string | string[];
    keyword?: string | string[];
    sort?: string | string[];
  }>;
};

const SEARCH_OPTIONS: SearchOption[] = [
  'title',
  'content',
  'title_content',
  'title_content_comment',
];
const SEARCH_SORTS: SearchSort[] = ['latest', 'relevance'];

const getSearchParam = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] : value;
};

const getSearchSize = (value?: string) => {
  const parsedSize = Number(value);
  return Number.isInteger(parsedSize) && parsedSize > 0 ? parsedSize : 10;
};

const getSearchOption = (value?: string): SearchOption => {
  return SEARCH_OPTIONS.includes(value as SearchOption)
    ? (value as SearchOption)
    : 'title';
};

const getSearchSort = (value?: string): SearchSort => {
  return SEARCH_SORTS.includes(value as SearchSort)
    ? (value as SearchSort)
    : 'latest';
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const keyword = getSearchParam(params.keyword)?.trim() ?? '';
  const size = getSearchSize(getSearchParam(params.size));
  const option = getSearchOption(getSearchParam(params.option));
  const sort = getSearchSort(getSearchParam(params.sort));

  return (
    <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-5 py-10">
      {keyword ? (
        <SearchResult
          keyword={keyword}
          size={size}
          option={option}
          sort={sort}
        />
      ) : (
        <p className="text-sm text-neutral-50">검색어를 입력해 주세요.</p>
      )}
    </main>
  );
};

export default SearchPage;
