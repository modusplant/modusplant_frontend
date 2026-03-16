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
      className={cn(
        'fixed bottom-10 left-1/2 z-99 -translate-x-1/2 transform',
        'rounded-[15px] bg-neutral-100 px-16 py-7 shadow-lg lg:h-17',
        'text-neutral-10 min-w-80 text-center font-medium lg:text-[16px]',
        'transition-all duration-300',
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      {description}
    </div>
  );
}
