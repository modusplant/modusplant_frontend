import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger'
  | 'default'
  /** @deprecated use primary */
  | 'point'
  /** @deprecated use tertiary */
  | 'point2'
  /** @deprecated use disabled prop */
  | 'deactivate';

type ResolvedButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger'
  | 'default';

const resolveButtonVariant = (
  variant: ButtonVariant
): ResolvedButtonVariant => {
  switch (variant) {
    case 'point':
      return 'primary';
    case 'point2':
      return 'tertiary';
    case 'deactivate':
      return 'secondary';
    default:
      return variant;
  }
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant.
   * - primary: primary CTA (legacy point alias)
   * - secondary: supporting CTA
   * - tertiary: outlined CTA (legacy point2 alias)
   * - ghost: low-emphasis action
   * - danger: destructive action
   * - default: neutral surface button
   * - point: deprecated, use primary
   * - point2: deprecated, use tertiary
   * - deactivate: deprecated, use disabled prop
   */
  variant?: ButtonVariant;
  /**
   * Button size.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the button should fill its container width.
   */
  fullWidth?: boolean;
  /**
   * Loading state. Children remain rendered to preserve the accessible name.
   */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      disabled,
      loading = false,
      children,
      'aria-busy': ariaBusy,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = resolveButtonVariant(variant);
    const isLegacyDeactivate = variant === 'deactivate';
    const isDisabled = disabled || loading || isLegacyDeactivate;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? true : ariaBusy}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors',
          'focus-visible:ring-focus-ring cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          loading && 'gap-2',
          {
            'text-text-default border-border-muted border bg-surface-card':
              resolvedVariant === 'default',
            'bg-action-primary-bg hover:bg-action-primary-hover text-action-primary-fg':
              resolvedVariant === 'primary',
            'bg-action-secondary-bg hover:bg-action-secondary-hover text-action-primary-fg':
              resolvedVariant === 'secondary',
            'border-action-tertiary-border text-action-tertiary-fg hover:bg-action-tertiary-hover border':
              resolvedVariant === 'tertiary',
            'text-text-subtle hover:bg-surface-muted':
              resolvedVariant === 'ghost',
            'bg-feedback-error hover:bg-feedback-error text-action-primary-fg':
              resolvedVariant === 'danger',
          },

          // TODO(button-migration): remove deactivate alias after all usages move to disabled.
          {
            'bg-action-disabled-bg text-action-disabled-fg cursor-not-allowed':
              isLegacyDeactivate,
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...props}
      >
        {loading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
