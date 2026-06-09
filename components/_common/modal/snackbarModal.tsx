import { OVERLAY_Z_INDEX } from '@/lib/constants/overlayLayers';
import { cn } from '@/lib/utils/tailwindHelper';

interface SnackbarModalProps {
  description: string;
  isAnimating: boolean;
}

export default function SnackbarModal({
  description,
  isAnimating,
}: SnackbarModalProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'fixed bottom-10 left-1/2 -translate-x-1/2 transform',
        OVERLAY_Z_INDEX.toast,
        'bg-surface-card rounded-[15px] px-16 py-7 shadow-lg lg:h-17',
        'text-text-strong min-w-80 text-center font-medium lg:text-[16px]',
        'transition-all duration-300',
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      {description}
    </div>
  );
}
