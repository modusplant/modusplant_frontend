'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
import { cn } from '@/lib/utils/tailwindHelper';

interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'danger';
  textAlign?: 'left' | 'center' | 'right';
}

interface DropdownProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  items?: DropdownItem[];
  children?: React.ReactNode;
  trigger: React.ReactNode;
  position?: 'right' | 'left' | 'center';
  width?: string;
  className?: string;
  contentRole?: 'menu' | 'listbox' | 'dialog';
  contentAriaLabel?: string;
}

type DropdownTriggerProps = React.HTMLAttributes<HTMLElement> &
  React.RefAttributes<HTMLElement> & {
    disabled?: boolean;
    'data-dropdown-trigger'?: boolean;
  };

export default function Dropdown({
  isOpen,
  onOpen,
  onClose,
  items,
  children,
  trigger,
  position = 'right',
  width = 'w-24',
  className,
  contentRole,
  contentAriaLabel,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pendingFocusRef = useRef<'first' | 'last' | null>(null);
  const generatedId = useId();
  const dropdownId = `dropdown-${generatedId}`;
  const hasMenuItems = !!items?.length;
  const resolvedContentRole = contentRole ?? (hasMenuItems ? 'menu' : 'dialog');

  const focusMenuItem = useCallback((placement: 'first' | 'last' | number) => {
    if (!items?.length) return;

    const enabledIndexes = items
      .map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index >= 0);

    if (!enabledIndexes.length) return;

    const targetIndex =
      placement === 'first'
        ? enabledIndexes[0]
        : placement === 'last'
          ? enabledIndexes[enabledIndexes.length - 1]
          : enabledIndexes.includes(placement)
            ? placement
            : enabledIndexes[0];

    itemRefs.current[targetIndex]?.focus();
  }, [items]);

  const closeDropdown = useCallback((returnFocus = true) => {
    onClose();

    if (returnFocus) {
      requestAnimationFrame(() => {
        dropdownRef.current
          ?.querySelector<HTMLElement>('[data-dropdown-trigger="true"]')
          ?.focus();
      });
    }
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    if (!isOpen || !pendingFocusRef.current) return;

    requestAnimationFrame(() => {
      if (hasMenuItems) {
        focusMenuItem(pendingFocusRef.current ?? 'first');
      }

      pendingFocusRef.current = null;
    });
  }, [focusMenuItem, hasMenuItems, isOpen]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!hasMenuItems) return;

      event.preventDefault();
      pendingFocusRef.current = event.key === 'ArrowDown' ? 'first' : 'last';

      if (isOpen) {
        focusMenuItem(pendingFocusRef.current);
        pendingFocusRef.current = null;
        return;
      }

      onOpen?.();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (hasMenuItems) {
        pendingFocusRef.current = 'first';
      }

      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeDropdown();
    }
  };

  const handleContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (!hasMenuItems) return;

    const enabledIndexes = (items ?? [])
      .map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index >= 0);

    if (!enabledIndexes.length) return;

    const currentIndex = itemRefs.current.findIndex(
      (node) => node === document.activeElement
    );
    const currentEnabledPosition = enabledIndexes.indexOf(currentIndex);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextPosition =
        currentEnabledPosition >= 0
          ? (currentEnabledPosition + 1) % enabledIndexes.length
          : 0;
      focusMenuItem(enabledIndexes[nextPosition]);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextPosition =
        currentEnabledPosition >= 0
          ? (currentEnabledPosition - 1 + enabledIndexes.length) %
            enabledIndexes.length
          : enabledIndexes.length - 1;
      focusMenuItem(enabledIndexes[nextPosition]);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusMenuItem('first');
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusMenuItem('last');
    }
  };

  const triggerElement = React.isValidElement<DropdownTriggerProps>(trigger)
    ? (trigger as ReactElement<DropdownTriggerProps>)
    : null;

  const enhancedTrigger = triggerElement
    ? // eslint-disable-next-line react-hooks/refs -- cloneElement merges aria/keyboard props into the existing interactive trigger without changing the public API.
      React.cloneElement(triggerElement, {
        'data-dropdown-trigger': true,
        'aria-haspopup': resolvedContentRole,
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? dropdownId : undefined,
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          triggerElement.props.onKeyDown?.(event);

          if (!event.defaultPrevented) {
            handleTriggerKeyDown(event);
          }
        },
      })
    : trigger;

  const positionClass = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  }[position];

  return (
    <div className="relative" ref={dropdownRef}>
      {enhancedTrigger}

      {isOpen && (
        <div
          id={dropdownId}
          role={resolvedContentRole}
          aria-label={
            contentAriaLabel ??
            (hasMenuItems ? '드롭다운 메뉴' : '드롭다운 패널')
          }
          aria-modal={resolvedContentRole === 'dialog' ? false : undefined}
          tabIndex={resolvedContentRole === 'dialog' ? -1 : undefined}
          onKeyDown={handleContentKeyDown}
          className={cn(
            'absolute top-12 z-50',
            'border-surface-99 rounded-[10px] border bg-neutral-100 shadow-sm',
            'p-1.5',
            'text-sm font-medium',
            positionClass,
            width,
            className
          )}
        >
          {children ??
            items?.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  closeDropdown();
                }}
                disabled={item.disabled}
                role={resolvedContentRole === 'listbox' ? 'option' : 'menuitem'}
                aria-selected={
                  resolvedContentRole === 'listbox' ? false : undefined
                }
                aria-disabled={item.disabled}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={cn(
                  'h-10 w-full cursor-pointer transition-colors',
                  'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',

                  {
                    'first:rounded-t-[10px]': true,
                    'last:rounded-b-[10px]': true,
                    'cursor-not-allowed opacity-50': item.disabled,
                  },
                  item.className
                )}
              >
                <div
                  className={cn(
                    'w-full rounded-[10px] px-5 py-2.5',
                    item.variant === 'danger'
                      ? 'hover:bg-surface-98 text-red-500'
                      : 'text-neutral-20 hover:bg-surface-98',
                    item.textAlign === 'left' && 'text-left',
                    item.textAlign === 'center' && 'text-center',
                    item.textAlign === 'right' && 'text-right'
                  )}
                >
                  {item.label}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
