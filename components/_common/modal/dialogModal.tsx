import Button from '@/components/_common/button';
import { OVERLAY_Z_INDEX } from '@/lib/constants/overlayLayers';
import { useOverlayLifecycle } from '@/lib/hooks/common/useOverlayLifecycle';
import { cn } from '@/lib/utils/tailwindHelper';
import { useId, useRef } from 'react';

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
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleCancelAndClose = () => {
    onCancel?.();
    hideModal();
  };

  const handleConfirmAndClose = () => {
    onConfirm?.();
    hideModal();
  };

  useOverlayLifecycle({
    isOpen: true,
    onEscape: handleCancelAndClose,
    initialFocusRef: dialogRef,
  });

  return (
    <div
      className={cn(
        'bg-surface-overlay fixed inset-0 flex items-center justify-center select-none',
        OVERLAY_Z_INDEX.modal
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={handleCancelAndClose}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-surface-card w-85 rounded-2xl py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1 py-10">
          <h2
            id={titleId}
            className={cn(
              'text-text-strong text-xl text-[17px] font-semibold',
              align === 'center' && 'text-center',
              shouldUseLineBreak && 'whitespace-pre-line'
            )}
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className={cn(
              'text-text-body text-[16px]',
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
              onClick={handleCancelAndClose}
              className="text-text-strong min-w-20 rounded-[7px] px-5 py-3 text-[15px]"
            >
              취소
            </Button>
          )}
          <Button
            variant="point"
            size="lg"
            onClick={handleConfirmAndClose}
            className="text-action-primary-fg min-w-20 rounded-[7px] px-5 py-3 text-[15px]"
          >
            {buttonText || 'OK'}
          </Button>
        </div>
      </div>
    </div>
  );
}
