'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import SearchBar from './searchbar';
import SearchHistory from './searchHistory';
import { useAuthStore } from '@/lib/store/authStore';
import { useGetSearchHistory } from '@/lib/hooks/search/useGetSearchHistory';
import { useDeleteSearchHistory } from '@/lib/hooks/search/useDeleteSearchHistory';
import { useEscapeKey } from '@/lib/hooks/common/useEscapeKey';
import { useFocusTrap } from '@/lib/hooks/common/useFocusTrap';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFormValues {
  keyword: string;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [pendingSearchUrl, setPendingSearchUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      keyword: '',
    },
  });
  const { isAuthenticated, user } = useAuthStore();
  const { data: searchHistory } = useGetSearchHistory(
    isOpen && isAuthenticated && !!user
  );
  const { mutate: deleteSearchHistory, isPending: isDeletingSearchHistory } =
    useDeleteSearchHistory();
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleSearch = (keyword: string) => {
    if (pendingSearchUrl) return;

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    const searchParams = new URLSearchParams({
      size: '9',
      target: 'title',
      keyword: trimmedKeyword,
      sort: 'latest',
    });

    const nextUrl = `/search?${searchParams.toString()}`;

    setPendingSearchUrl(nextUrl);
    router.push(nextUrl);
  };

  const onSubmit = ({ keyword }: SearchFormValues) => {
    handleSearch(keyword);
  };

  const handleClose = () => {
    if (pendingSearchUrl) return;

    reset();
    onClose();
  };

  useEscapeKey(handleClose, isOpen);
  useFocusTrap(dialogRef, {
    isActive: isOpen,
    autoFocus: false,
    restoreFocus: true,
    trapTab: true,
  });

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevUserSelect = document.body.style.userSelect;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.userSelect = 'none';
      document.body.classList.add('overlay-open');
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.userSelect = prevUserSelect;
      document.body.classList.remove('overlay-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!pendingSearchUrl) return;

    const currentUrl = `${pathname}?${currentSearchParams.toString()}`;
    if (currentUrl !== pendingSearchUrl) return;

    reset();
    onClose();

    window.setTimeout(() => {
      setPendingSearchUrl(null);
    }, 0);
  }, [currentSearchParams, onClose, pathname, pendingSearchUrl, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex min-h-screen justify-center bg-white"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div className="flex w-full max-w-[780px] flex-col gap-5 p-5 px-5 md:py-8">
        <div className="hidden px-4 md:block">
          <button
            type="button"
            className="text-neutral-20 ml-auto flex h-6 w-6 items-center justify-center"
            onClick={handleClose}
            disabled={!!pendingSearchUrl}
            aria-label="검색 오버레이 닫기"
          >
            <X className="text-neutral-80 h-8 w-8 shrink-0" />
          </button>
        </div>
        <div className="flex gap-1 md:block">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <SearchBar
              placeholder="검색어를 입력해 주세요"
              autoFocus
              disabled={!!pendingSearchUrl}
              {...register('keyword')}
            />
          </form>
          <button
            type="button"
            className="leading-1.2 text-neutral-20 flex w-[37px] items-center justify-center text-sm font-semibold -tracking-[0.01em] md:hidden"
            onClick={handleClose}
            disabled={!!pendingSearchUrl}
            aria-label="검색 오버레이 닫기"
          >
            취소
          </button>
        </div>

        {/* 로그인 한 사용자에게만 검색 기록 표출 */}
        {isAuthenticated && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-neutral-5 text-[17px] leading-[1.2] font-semibold -tracking-[0.01em]">
                최근 검색어
              </p>
              <button
                type="button"
                className="text-[16px] leading-1.5 font-semibold -tracking-[0.01em] text-neutral-50"
                onClick={() => deleteSearchHistory()}
                disabled={!!pendingSearchUrl || isDeletingSearchHistory}
              >
                전체 삭제
              </button>
            </div>
            <SearchHistory
              data={searchHistory ?? []}
              onKeywordClick={handleSearch}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
