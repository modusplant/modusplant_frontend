import Button from '@/components/_common/button';
import { cn } from '@/lib/utils/tailwindHelper';

interface DialogModalProps {
  title: string;
  description: string;
  type: 'one-button' | 'two-button';
  buttonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideModal: () => void;
  align?: 'center';
  preserveLineBreak?: boolean;
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
  preserveLineBreak,
}: DialogModalProps) {
  return (
    <div
      className="fixed inset-0 z-99 flex items-center justify-center bg-black/20"
      onClick={hideModal}
    >
      <div
        className="w-85 rounded-2xl bg-neutral-100 py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1 py-10">
          <h2
            className={cn(
              'text-neutral-10 text-xl text-[17px] font-semibold',
              align === 'center' && 'text-center',
              preserveLineBreak && 'whitespace-pre-line'
            )}
          >
            {title}
          </h2>
          <p className="text-neutral-30 text-[16px]">{description}</p>
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
