import { HTMLAttributes } from 'react';
import { SignoutForm } from './SignoutForm';
import { cn } from '@/lib/utils/tailwindHelper';

interface DialogModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

export default function SignoutModal({ onClose, className }: DialogModalProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-99 flex items-center justify-center bg-black/20',
        className
      )}
      onClick={onClose}
    >
      <div
        className="rounded-2xl bg-neutral-100 py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <SignoutForm className="p-10" />
      </div>
    </div>
  );
}
