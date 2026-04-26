'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import PostListItem from '@/components/mypage/common/postListItem';
import SearchBar from './searchbar';
import SearchHistory from './searchHistory';
import { useAuthStore } from '@/lib/store/authStore';
import { useGetSearchHistory } from '@/lib/hooks/search/useGetSearchHistory';
import { useGetSearchResult } from '@/lib/hooks/search/useGetSearchResult';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFormValues {
  keyword: string;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      keyword: '',
    },
  });
  const { isAuthenticated, user } = useAuthStore();
  const { data: searchHistory = [] } = useGetSearchHistory(
    isOpen && isAuthenticated && !!user
  );

  const {
    data: searchResult,
    isFetching: isSearchResultFetching,
    isError: isSearchResultError,
    error: searchResultError,
  } = useGetSearchResult(
    {
      size: 10,
      option: 'title',
      keyword: submittedKeyword,
      sort: 'latest',
    },
    isOpen
  );
  const searchPosts = searchResult?.posts ?? [];

  const onSubmit = ({ keyword }: SearchFormValues) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setSubmittedKeyword(trimmedKeyword);
  };

  const handleClose = useCallback(() => {
    setSubmittedKeyword('');
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-[780px] flex-col gap-5 px-5 py-8">
        <div className="px-4">
          <button
            type="button"
            className="text-neutral-20 ml-auto flex h-6 w-6 items-center justify-center"
            onClick={handleClose}
            aria-label="검색 오버레이 닫기"
          >
            <X className="text-neutral-80 h-8 w-8 shrink-0" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SearchBar
            placeholder="검색어를 입력해 주세요"
            autoFocus
            {...register('keyword')}
          />
        </form>

        {submittedKeyword && (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2">
            {isSearchResultFetching && (
              <p className="px-2 text-sm text-neutral-50">
                검색 결과를 불러오는 중입니다.
              </p>
            )}

            {isSearchResultError && (
              <p className="px-2 text-sm text-red-500">
                {searchResultError.message}
              </p>
            )}

            {!isSearchResultFetching &&
              !isSearchResultError &&
              searchPosts.length === 0 && (
                <p className="px-2 text-sm text-neutral-50">
                  검색 결과가 없습니다.
                </p>
              )}

            {/* {!isSearchResultFetching &&
              !isSearchResultError &&
              searchPosts.map((post) => (
                <PostListItem key={post.postId} post={post} />
              ))} */}
          </div>
        )}

        {/* 로그인 한 사용자에게만 검색 기록 표출 */}
        {!submittedKeyword && isAuthenticated && user && (
          <SearchHistory data={searchHistory} />
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
