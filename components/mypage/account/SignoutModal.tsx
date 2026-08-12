import { HTMLAttributes, useEffect, useRef } from 'react';
import { SignoutForm, SignoutFormValues } from './SignoutForm';
import { cn } from '@/lib/utils/tailwindHelper';
import Button from '@/components/_common/button';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/lib/hooks/common/useEscapeKey';
import { useFocusTrap } from '@/lib/hooks/common/useFocusTrap';

interface DialogModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  handleSignout: (formValues: SignoutFormValues) => void;
  savedFormValues?: SignoutFormValues;
}

export default function SignoutModal({
  handleSignout,
  savedFormValues,
  onClose,
  className,
}: DialogModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, true);
  useFocusTrap(dialogRef, {
    isActive: true,
    autoFocus: true,
    restoreFocus: true,
    trapTab: true,
  });

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
  return (
    <div
      className={cn(
        'fixed inset-0 z-99 flex items-center justify-center bg-black/20',
        className
      )}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="회원 탈퇴"
        tabIndex={-1}
        className="relative max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-100 py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-3 right-3 border-none p-2"
        >
          <X />
        </Button>
        <SignoutForm
          className="px-10 py-5 sm:py-10"
          savedFormValues={savedFormValues}
          handleSignout={handleSignout}
        />
      </div>
    </div>
  );
}
