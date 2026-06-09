import { HTMLAttributes, useEffect } from 'react';
import { SignoutForm, SignoutFormValues } from './SignoutForm';
import { cn } from '@/lib/utils/tailwindHelper';
import Button from '@/components/_common/button';
import { OVERLAY_Z_INDEX } from '@/lib/constants/overlayLayers';
import { X } from 'lucide-react';

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
        'bg-surface-overlay fixed inset-0 flex items-center justify-center',
        OVERLAY_Z_INDEX.modal,
        className
      )}
      onClick={onClose}
    >
      <div
        className="bg-surface-card relative rounded-2xl py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
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
