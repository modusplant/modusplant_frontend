import React, { forwardRef, useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
  helperText?: React.ReactNode;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      className,
      error,
      helperText,
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
    const textareaId = id ?? generatedId;
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let nextValue = e.target.value;

      if (maxLength && nextValue.length > maxLength) {
        nextValue = nextValue.slice(0, maxLength);
        e.target.value = nextValue;
      }

      setCharCount(nextValue.length);
      onChange?.(e);
    };

    const isError = !!error;
    const errorMessage = typeof error === 'string' ? error : undefined;
    const helperId =
      helperText && !errorMessage ? `${textareaId}-helper` : undefined;
    const errorId = errorMessage ? `${textareaId}-error` : undefined;
    const countId = showCount ? `${textareaId}-count` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId, helperId, countId].filter(Boolean).join(' ') ||
      undefined;

    const textarea = (
      <textarea
        id={textareaId}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        aria-invalid={isError ? true : ariaInvalid}
        aria-describedby={describedBy}
        {...props}
        className={cn(
          'border-border-default min-h-30 w-full resize-none rounded-lg border',
          'px-4 py-4',
          isError && 'border-feedback-error',
          'focus:border-focus-ring transition-colors focus:outline-none',
          'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'text-text-subtle placeholder:text-text-placeholder text-[16px] leading-[1.2] tracking-[-0.01em]',
          showCount && 'pb-9',
          className
        )}
      />
    );

    const control = showCount ? (
      <div className="relative">
        {textarea}
        <span
          id={countId}
          className="typo-regular14 text-text-placeholder absolute right-4 bottom-3"
          aria-live="polite"
        >
          {charCount}
          {maxLength ? `/${maxLength}` : ''}
        </span>
      </div>
    ) : (
      textarea
    );

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
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
