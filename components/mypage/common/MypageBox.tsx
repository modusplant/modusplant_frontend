import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

interface MypageBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function MypageBox({
  children,
  className,
  ...props
}: MypageBoxProps) {
  return (
    <div
      className={cn(
        'border-surface-98 rounded-xl border bg-white p-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
