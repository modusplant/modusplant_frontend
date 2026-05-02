'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/_common/postCard';
import { useGetInfiniteSearchResult } from '@/lib/hooks/search/useGetSearchResult';
import { SearchOption, SearchSort } from '@/lib/types/search';
import { cn } from '@/lib/utils/tailwindHelper';
import SearchCategoryFilter from './searchCategoryFilter';
import SearchOptionTabs from './searchOptionTabs';
import SearchBar from './searchbar';

interface SearchResultProps {
  keyword: string;
  enabled?: boolean;
  size?: number;
  option?: SearchOption;
  sort?: SearchSort;
  primaryCategoryId?: string;
  secondaryCategoryIds?: string[];
}

const SEARCH_SORT_OPTIONS: Array<{
  value: SearchSort;
  label: string;
}> = [
  { value: 'latest', label: '최신순' },
  { value: 'relevance', label: '정확도순' },
];

const SearchResult = ({
  keyword,
  enabled = true,
  size = 9,
  option = 'title',
  sort = 'latest',
  primaryCategoryId = 'all',
  secondaryCategoryIds = ['all'],
}: SearchResultProps) => {
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);
  const trimmedKeyword = keyword.trim();
  const selectedPrimaryCategoryId =
    primaryCategoryId !== 'all' ? primaryCategoryId : undefined;
  const selectedSecondaryCategoryId =
    secondaryCategoryIds
      .filter((categoryId) => categoryId !== 'all')
      .join(',') || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetInfiniteSearchResult(
    {
      size,
      option,
      keyword: trimmedKeyword,
      sort,
      primaryCategoryId: selectedPrimaryCategoryId,
      secondaryCategoryId: selectedSecondaryCategoryId,
    },
    enabled && !!trimmedKeyword
  );

  const searchPosts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.posts ?? []);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 현재 검색 조건과 변경된 조건을 합쳐 URL 쿼리스트링으로 반영한다.
  const pushSearch = ({
    nextKeyword = trimmedKeyword,
    nextOption = option,
    nextSort = sort,
    nextPrimaryCategoryId = primaryCategoryId,
    nextSecondaryCategoryIds = secondaryCategoryIds,
  }: {
    nextKeyword?: string;
    nextOption?: SearchOption;
    nextSort?: SearchSort;
    nextPrimaryCategoryId?: string;
    nextSecondaryCategoryIds?: string[];
  }) => {
    const normalizedKeyword = nextKeyword.trim();
    if (!normalizedKeyword) return;

    const searchParams = new URLSearchParams({
      size: String(size),
      option: nextOption,
      keyword: normalizedKeyword,
      sort: nextSort,
    });

    if (nextPrimaryCategoryId && nextPrimaryCategoryId !== 'all') {
      searchParams.set('primaryCategoryId', nextPrimaryCategoryId);
    }

    const selectedSecondaryCategoryIds = nextSecondaryCategoryIds.filter(
      (categoryId) => categoryId !== 'all'
    );
    if (selectedSecondaryCategoryIds.length > 0) {
      searchParams.set(
        'secondaryCategoryId',
        selectedSecondaryCategoryIds.join(',')
      );
    }

    router.push(`/search?${searchParams.toString()}`);
  };

  // 검색어 입력 form 제출 시 기존 옵션과 카테고리 조건을 유지한 채 키워드만 갱신한다.
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextKeyword = String(formData.get('keyword') ?? '');
    pushSearch({ nextKeyword });
  };

  // 검색 옵션 탭 변경 시 현재 키워드와 카테고리 조건을 유지한다.
  const handleOptionChange = (nextOption: SearchOption) => {
    if (nextOption === option) return;
    pushSearch({ nextOption });
  };

  // 정렬 변경 시 현재 검색어, 옵션, 카테고리 조건을 유지한다.
  const handleSortChange = (nextSort: SearchSort) => {
    if (nextSort === sort) return;
    pushSearch({ nextSort });
  };

  // 1차 카테고리가 바뀌면 기존 2차 카테고리 선택은 더 이상 유효하지 않아 초기화한다.
  const handlePrimaryCategoryChange = (nextPrimaryCategoryId: string) => {
    pushSearch({
      nextPrimaryCategoryId,
      nextSecondaryCategoryIds: ['all'],
    });
  };

  // 2차 카테고리 변경은 현재 검색어, 옵션, 1차 카테고리를 유지한 채 URL에 반영한다.
  const handleSecondaryCategoriesChange = (
    nextSecondaryCategoryIds: string[]
  ) => {
    pushSearch({ nextSecondaryCategoryIds });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Image
            src="/icon/loading.gif"
            alt="Loading"
            width={20}
            height={20}
            unoptimized
          />
        </div>
      );
    }

    if (isError) {
      return (
        <p className="px-2 text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : '검색 결과를 조회할 수 없습니다.'}
        </p>
      );
    }

    if (searchPosts.length === 0) {
      return (
        <p className="px-2 text-sm text-neutral-50">검색 결과가 없습니다.</p>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-16">
          {searchPosts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>

        <div ref={observerTarget} className="h-px" />

        {isFetchingNextPage && (
          <div className="flex items-center justify-center p-4">
            <Image
              src="/icon/loading.gif"
              alt="Loading"
              width={20}
              height={20}
              unoptimized
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex w-full max-w-[1320px] flex-col gap-8">
      <div className="flex flex-col gap-6">
        <form
          className="mx-auto w-full max-w-[780px]"
          onSubmit={handleSearchSubmit}
        >
          <SearchBar
            key={trimmedKeyword}
            name="keyword"
            defaultValue={trimmedKeyword}
            placeholder="검색어를 입력해 주세요"
          />
        </form>
        <SearchOptionTabs
          selectedOption={option}
          onChange={handleOptionChange}
        />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchCategoryFilter
            primaryCategoryId={primaryCategoryId}
            secondaryCategoryIds={secondaryCategoryIds}
            onPrimaryCategoryChange={handlePrimaryCategoryChange}
            onSecondaryCategoriesChange={handleSecondaryCategoriesChange}
          />

          <div
            className="flex shrink-0 items-center gap-[10px] self-end text-[16px] leading-[1.2] font-semibold tracking-[-0.01em]"
            aria-label="검색 결과 정렬"
          >
            {SEARCH_SORT_OPTIONS.map((sortOption) => {
              const isSelected = sort === sortOption.value;

              return (
                <button
                  key={sortOption.value}
                  type="button"
                  className={cn(
                    'text-neutral-80 cursor-pointer p-[14px] transition-colors focus-visible:outline-none',
                    isSelected && 'text-neutral-20'
                  )}
                  aria-pressed={isSelected}
                  onClick={() => handleSortChange(sortOption.value)}
                >
                  {sortOption.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default SearchResult;
