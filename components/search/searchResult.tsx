'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/_common/postCard';
import { useGetInfiniteSearchResult } from '@/lib/hooks/search/useGetSearchResult';
import { SearchOption, SearchSort } from '@/lib/types/search';
import SearchBar from './searchbar';

interface SearchResultProps {
  keyword: string;
  enabled?: boolean;
  size?: number;
  option?: SearchOption;
  sort?: SearchSort;
}

export default function SearchResult({
  keyword,
  enabled = true,
  size = 10,
  option = 'title',
  sort = 'latest',
}: SearchResultProps) {
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);
  const trimmedKeyword = keyword.trim();

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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextKeyword = String(formData.get('keyword') ?? '').trim();
    if (!nextKeyword) return;

    const searchParams = new URLSearchParams({
      size: String(size),
      option,
      keyword: nextKeyword,
      sort,
    });

    router.push(`/search?${searchParams.toString()}`);
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
    <div className="flex w-full max-w-[1320px] flex-col gap-10">
      <div className="px-5 py-8">
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
      </div>

      {renderContent()}
    </div>
  );
}
