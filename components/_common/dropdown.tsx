'use client';

import React, {
  useRef,
  useEffect,
  useId,
  isValidElement,
  cloneElement,
} from 'react';
import { cn } from '@/lib/utils/tailwindHelper';
import { useEscapeKey } from '@/lib/hooks/common/useEscapeKey';
import { useFocusTrap } from '@/lib/hooks/common/useFocusTrap';

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
  onClose: () => void;
  items?: DropdownItem[];
  children?: React.ReactNode;
  trigger: React.ReactNode;
  position?: 'right' | 'left' | 'center';
  width?: string;
  className?: string;
}

export default function Dropdown({
  isOpen,
  onClose,
  items,
  children,
  trigger,
  position = 'right',
  width = 'w-24',
  className,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEscapeKey(onClose, isOpen);
  useFocusTrap(menuRef, {
    isActive: isOpen,
    autoFocus: !!items?.length,
    restoreFocus: true,
    trapTab: false,
  });

  const positionClass = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  }[position];

  const triggerElement = isValidElement<React.AriaAttributes>(trigger)
    ? cloneElement(trigger, {
        'aria-haspopup': items ? 'menu' : 'true',
        'aria-expanded': isOpen,
        'aria-controls': menuId,
      })
    : trigger;

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!items) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();

    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)'
      ) ?? []
    );
    if (menuItems.length === 0) return;

    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLButtonElement
    );
    const nextIndex =
      e.key === 'ArrowDown'
        ? (currentIndex + 1) % menuItems.length
        : (currentIndex - 1 + menuItems.length) % menuItems.length;
    menuItems[nextIndex]?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {triggerElement}

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role={items ? 'menu' : undefined}
          aria-orientation={items ? 'vertical' : undefined}
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
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
                role="menuitem"
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                disabled={item.disabled}
                className={cn(
                  'h-10 w-full cursor-pointer transition-colors',

                  {
                    'first:rounded-t-[10px]': true,
                    'last:rounded-b-[10px]': true,
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
