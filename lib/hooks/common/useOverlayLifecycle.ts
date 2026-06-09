import { RefObject, useEffect, useRef } from 'react';

let bodyLockCount = 0;
let previousBodyStyle: {
  overflow: string;
  userSelect: string;
} | null = null;

const lockBodyInteraction = () => {
  if (bodyLockCount === 0) {
    previousBodyStyle = {
      overflow: document.body.style.overflow,
      userSelect: document.body.style.userSelect,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
  }

  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);

    if (bodyLockCount === 0 && previousBodyStyle) {
      document.body.style.overflow = previousBodyStyle.overflow;
      document.body.style.userSelect = previousBodyStyle.userSelect;
      previousBodyStyle = null;
    }
  };
};

interface OverlayLifecycleOptions {
  isOpen: boolean;
  onEscape?: () => void;
  lockScroll?: boolean;
  returnFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function useOverlayLifecycle({
  isOpen,
  onEscape,
  lockScroll = true,
  returnFocus = true,
  initialFocusRef,
}: OverlayLifecycleOptions) {
  const onEscapeRef = useRef(onEscape);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isOpen) return;

    if (returnFocus && document.activeElement instanceof HTMLElement) {
      restoreFocusRef.current = document.activeElement;
    }

    const unlockBody = lockScroll ? lockBodyInteraction() : undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onEscapeRef.current?.();
    };

    window.addEventListener('keydown', handleKeyDown);

    if (initialFocusRef?.current) {
      window.setTimeout(() => {
        initialFocusRef.current?.focus({ preventScroll: true });
      }, 0);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockBody?.();

      const restoreTarget = restoreFocusRef.current;
      if (returnFocus && restoreTarget && document.contains(restoreTarget)) {
        window.setTimeout(() => {
          restoreTarget.focus({ preventScroll: true });
        }, 0);
      }
    };
  }, [initialFocusRef, isOpen, lockScroll, returnFocus]);
}
