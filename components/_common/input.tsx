import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils/tailwindHelper';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showPasswordToggle?: boolean;
  showCount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      showPasswordToggle = false,
      showCount = false,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const [charCount, setCharCount] = useState(
      props.value
        ? String(props.value).length
        : props.defaultValue
          ? String(props.defaultValue).length
          : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (maxLength && value.length > maxLength) {
        value = value.slice(0, maxLength);
        e.target.value = value;
      }
      setCharCount(value.length);

      // 상위 컴포넌트나 react-hook-form에서 전달한 onChange가 동작하도록 유지
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const inputType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    const isError = !!error;

    if (showPasswordToggle && type === 'password') {
      // 비밀번호 토글이 필요한 경우만 wrapper div 사용
      return (
        <div className="relative flex items-center">
          <input
            type={inputType}
            className={cn(
              'text-neutral-0 placeholder:text-neutral-70 w-full bg-transparent text-base',
              'rounded-lg border px-4 py-3 outline-none',
              isError ? 'border-system-alert' : 'border-surface-stroke-2',
              'focus:border-primary-50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              className
            )}
            ref={ref}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-neutral-70 hover:text-neutral-20 absolute right-3 transition-colors"
            aria-label="비밀번호 표시/숨김"
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

    // 일반 input의 경우
    if (showCount) {
      return (
        <div className="relative flex items-center">
          <input
            type={inputType}
            className={cn(
              'placeholder:text-neutral-70 placeholder:typo-regular14 w-full bg-transparent',
              'rounded-lg border px-4 py-3 outline-none',
              isError ? 'border-system-alert' : 'border-surface-stroke-2',
              'focus:border-primary-50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              'pr-16',
              className
            )}
            ref={ref}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          <span className="typo-regular14 text-neutral-70 absolute right-4">
            {charCount}
            {maxLength ? `/${maxLength}` : ''}
          </span>
        </div>
      );
    }

    // showCount가 없는 일반 input 태그 반환
    return (
      <input
        type={inputType}
        className={cn(
          'text-neutral-0 placeholder:text-neutral-70 w-full bg-transparent text-base',
          'rounded-lg border px-4 py-3 outline-none',
          isError ? 'border-system-alert' : 'border-surface-stroke-2',
          'focus:border-primary-50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          className
        )}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
