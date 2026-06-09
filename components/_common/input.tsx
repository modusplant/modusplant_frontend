import React, { forwardRef, useEffect, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/tailwindHelper';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  helperText?: React.ReactNode;
  showPasswordToggle?: boolean;
  showCount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      className,
      type,
      error,
      helperText,
      showPasswordToggle = false,
      showCount = false,
      maxLength,
      onChange,
      value,
      defaultValue,
      required,
      disabled,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(
      value
        ? String(value).length
        : defaultValue
          ? String(defaultValue).length
          : 0
    );

    useEffect(() => {
      if (value !== undefined) setCharCount(String(value).length);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let nextValue = e.target.value;

      if (maxLength && nextValue.length > maxLength) {
        nextValue = nextValue.slice(0, maxLength);
        e.target.value = nextValue;
      }

      setCharCount(nextValue.length);
      onChange?.(e);
    };

    const inputType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;
    const isError = !!error;
    const errorMessage = typeof error === 'string' ? error : undefined;
    const helperId = helperText && !errorMessage ? `${inputId}-helper` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;
    const countId = showCount ? `${inputId}-count` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId, helperId, countId].filter(Boolean).join(' ') ||
      undefined;

    const inputProps = {
      id: inputId,
      type: inputType,
      ref,
      maxLength,
      onChange: handleChange,
      value,
      defaultValue,
      required,
      disabled,
      'aria-invalid': isError ? true : ariaInvalid,
      'aria-describedby': describedBy,
      ...props,
    };

    const inputClassName = cn(
      'text-text-default placeholder:text-text-placeholder w-full bg-transparent text-base',
      'rounded-lg border px-4 py-3 outline-none',
      isError ? 'border-feedback-error' : 'border-border-default',
      'focus:border-focus-ring',
      'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors',
      className
    );

    const renderMeta = (control: React.ReactNode) => {
      if (!helperText && !errorMessage) return control;

      return (
        <div className="flex w-full flex-col gap-1.5">
          {control}
          {errorMessage ? (
            <p id={errorId} className="text-feedback-error text-sm">
              {errorMessage}
            </p>
          ) : (
            <p id={helperId} className="text-text-muted text-sm">
              {helperText}
            </p>
          )}
        </div>
      );
    };

    if (showPasswordToggle && type === 'password') {
      return renderMeta(
        <div className="relative flex items-center">
          <input
            {...inputProps}
            className={cn(inputClassName, 'pr-10')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            className="text-icon-muted hover:text-icon-default focus-visible:ring-focus-ring absolute right-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-controls={inputId}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <Eye width={16} height={16} stroke="currentColor" />
            ) : (
              <EyeOff width={16} height={16} stroke="currentColor" />
            )}
          </button>
        </div>
      );
    }

    if (showCount) {
      return renderMeta(
        <div className="relative flex items-center">
          <input
            {...inputProps}
            className={cn(
              'placeholder:text-text-placeholder placeholder:typo-regular14 w-full bg-transparent',
              'rounded-lg border px-4 py-3 outline-none',
              isError ? 'border-feedback-error' : 'border-border-default',
              'focus:border-focus-ring',
              'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              'pr-16',
              className
            )}
          />
          <span
            id={countId}
            className="typo-regular14 text-text-placeholder absolute right-4"
            aria-live="polite"
          >
            {charCount}
            {maxLength ? `/${maxLength}` : ''}
          </span>
        </div>
      );
    }

    return renderMeta(<input {...inputProps} className={inputClassName} />);
  }
);

Input.displayName = 'Input';

export { Input };
