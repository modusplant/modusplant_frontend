import { cn } from '@/lib/utils/tailwindHelper';

interface WriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default';
}

const WriteButton = (props: WriteButtonProps) => {
  const { variant = 'primary', className, ...restProps } = props;

  const { disabled } = restProps;

  return (
    <button
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-[7px] font-medium tracking-[-0.01em] transition-colors',
        'h-10 px-5 py-3.5 text-[15px] leading-[1.2]',
        {
          'bg-primary-50 hover:bg-primary-70 text-white': variant === 'primary',
          'border-surface-stroke border-[1px] border-solid text-[#4B4B4B]':
            variant === 'default',
        },
        { 'bg-neutral-90! cursor-not-allowed text-white': disabled },
        className
      )}
      {...restProps}
    />
  );
};

export default WriteButton;
