'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import SearchBar from './searchbar';
import SearchHistory from './searchHistory';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockSearchHistoryResponse = {
  status: 200,
  code: 'generic_success',
  message: '',
  data: ['벌레', '다육이', '선인장', '화분', '식물 영양제', '식물 병충해'],
};

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-[780px] flex-col gap-5 px-5 py-8">
        <div className="px-4">
          <button
            type="button"
            className="text-neutral-20 ml-auto flex h-6 w-6 items-center justify-center"
            onClick={onClose}
            aria-label="검색 오버레이 닫기"
          >
            <X className="text-neutral-80 h-8 w-8 shrink-0" />
          </button>
        </div>
        <SearchBar placeholder="검색어를 입력해 주세요" autoFocus />
        <SearchHistory data={mockSearchHistoryResponse.data} />
      </div>
    </div>
  );
};

export default SearchOverlay;
