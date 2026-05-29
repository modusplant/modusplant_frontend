'use client';

import { useEffect } from 'react';
import { DraftPostData } from '@/lib/types/post';
import DraftListItem from './DraftListItem';
import DraftListPopupHeader from './DraftListPopupHeader';
import { useDeleteDraftMutation } from '@/lib/hooks/community/useDeleteDraftMutation';
import { OVERLAY_Z_INDEX } from '@/lib/constants/overlayLayers';
import { cn } from '@/lib/utils/tailwindHelper';

interface DraftListPopupProps {
  isOpen: boolean;
  drafts: DraftPostData[];
  onClose: () => void;
  onSelectDraft: (draftPostId: string) => void;
}

const DraftListPopup = ({
  isOpen,
  drafts,
  onClose,
  onSelectDraft,
}: DraftListPopupProps) => {
  const { mutate: deleteDraft } = useDeleteDraftMutation();

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDeleteDraft = (draftPostId: string) => {
    if (confirm('임시저장 글을 삭제하시겠습니까?')) {
      deleteDraft(draftPostId);
    }
  };

  return (
    <div
      className={cn(
        'bg-surface-overlay-medium fixed inset-0 flex items-center justify-center px-4',
        OVERLAY_Z_INDEX.modal
      )}
      onClick={onClose}
    >
      <div
        className="border-border-subtle bg-surface-card w-full max-w-2xl rounded-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <DraftListPopupHeader onClose={onClose} />
        <div className="max-h-[60vh] overflow-y-auto px-5">
          <ul className="flex flex-col gap-2">
            {drafts.map((draftPost) => (
              <DraftListItem
                key={draftPost.postId}
                draftPost={draftPost}
                onClick={onSelectDraft}
                onDelete={handleDeleteDraft}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DraftListPopup;
