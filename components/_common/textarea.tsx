import { cn } from '@/lib/utils/tailwindHelper';

type TextareaProps = React.ComponentPropsWithRef<'textarea'>;

export default function Textarea({ ref, className, ...props }: TextareaProps) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        'border-surface-stroke-2 min-h-30 w-full resize-none rounded-lg border',
        'px-4 py-4',
        'focus:border-primary-50 transition-colors focus:outline-none',
        'text-neutral-20 placeholder:text-neutral-70 text-[16px] leading-[1.2] tracking-[-0.01em]',
        className
      )}
    />
  );
}
