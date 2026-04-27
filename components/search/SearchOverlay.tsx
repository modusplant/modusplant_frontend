'use client';

import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import SearchBar from './searchbar';
import SearchHistory from './searchHistory';
import { useAuthStore } from '@/lib/store/authStore';
import { useGetSearchHistory } from '@/lib/hooks/search/useGetSearchHistory';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFormValues {
  keyword: string;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      keyword: '',
    },
  });
  const { isAuthenticated, user } = useAuthStore();
  const { data: searchHistory } = useGetSearchHistory(
    isOpen && isAuthenticated && !!user
  );

  const onSubmit = ({ keyword }: SearchFormValues) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    const searchParams = new URLSearchParams({
      size: '10',
      option: 'title',
      keyword: trimmedKeyword,
      sort: 'latest',
    });

    reset();
    onClose();
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleClose = useCallback(() => {
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

        {/* 로그인 한 사용자에게만 검색 기록 표출 */}
        {isAuthenticated && <SearchHistory data={searchHistory ?? []} />}
      </div>
    </div>
  );
};

export default SearchOverlay;
