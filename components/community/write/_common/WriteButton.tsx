import { Button, type ButtonProps } from '@/components/_common/button';
import { cn } from '@/lib/utils/tailwindHelper';

interface WriteButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'default';
}

const WriteButton = (props: WriteButtonProps) => {
  const { variant = 'primary', className, children, ...restProps } = props;

  const { disabled } = restProps;
  const buttonVariant = variant === 'primary' ? 'primary' : 'default';

  return (
    <Button
      variant={buttonVariant}
      className={cn(
        // TODO(write-button-migration): remove this adapter after ActionButtonField uses the common Button directly.
        'flex cursor-pointer items-center justify-center rounded-[7px] font-medium tracking-[-0.01em] transition-colors',
        'h-10 px-5 py-3.5 text-[15px] leading-[1.2]',
        'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100',
        {
          'bg-action-primary-bg hover:bg-action-primary-strong-hover text-action-primary-fg':
            variant === 'primary',
          'border-border-subtle text-text-secondary border-[1px] border-solid bg-transparent hover:bg-transparent':
            variant === 'default',
        },
        { 'bg-action-disabled-bg cursor-not-allowed text-action-primary-fg': disabled },
        className
      )}
      {...restProps}
    >
      <span className="inline-flex items-center gap-2.5">{children}</span>
    </Button>
  );
};

export default WriteButton;
