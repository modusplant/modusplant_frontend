import Button from '@/components/_common/button';
import { useEscapeKey } from '@/lib/hooks/common/useEscapeKey';
import { useFocusTrap } from '@/lib/hooks/common/useFocusTrap';
import { cn } from '@/lib/utils/tailwindHelper';
import { useEffect, useId, useRef } from 'react';

interface DialogModalProps {
  title: string;
  description: string;
  type: 'one-button' | 'two-button';
  buttonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideModal: () => void;
  align?: 'center';
  shouldUseLineBreak?: boolean;
}

export default function DialogModal({
  title,
  description,
  type,
  buttonText,
  onConfirm,
  onCancel,
  hideModal,
  align,
  shouldUseLineBreak,
}: DialogModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const descriptionId = useId();

  // 오버레이 영역 스크롤 방지
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      userSelect: document.body.style.userSelect,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.userSelect = prev.userSelect;
    };
  }, []);

  useEscapeKey(() => {
    onCancel?.();
    hideModal();
  }, true);
  useFocusTrap(dialogRef, {
    isActive: true,
    autoFocus: true,
    restoreFocus: true,
    trapTab: true,
  });

  return (
    <div
      className="fixed inset-0 z-99 flex items-center justify-center bg-black/20 select-none"
      onClick={() => {
        onCancel?.();
        hideModal();
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={dialogRef}
        className="mx-5 w-85 rounded-2xl bg-neutral-100 py-4 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1 py-10">
          <h2
            id={dialogId}
            className={cn(
              'text-neutral-10 text-xl text-[17px] font-semibold',
              align === 'center' && 'text-center',
              shouldUseLineBreak && 'whitespace-pre-line'
            )}
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className={cn(
              'text-neutral-30 text-[16px]',
              align === 'center' && 'text-center',
              shouldUseLineBreak && 'whitespace-pre-line'
            )}
          >
            {description}
          </p>
        </div>
        <div className="flex h-10 justify-center gap-2.5 font-medium">
          {type === 'two-button' && (
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                onCancel?.();
                hideModal();
              }}
              className="text-neutral-10 min-w-20 rounded-[7px] px-5 py-3 text-[15px]"
            >
              취소
            </Button>
          )}
          <Button
            variant="point"
            size="lg"
            onClick={() => {
              onConfirm?.();
              hideModal();
            }}
            className="min-w-20 rounded-[7px] px-5 py-3 text-[15px] text-neutral-100"
          >
            {buttonText || 'OK'}
          </Button>
        </div>
      </div>
    </div>
  );
}
