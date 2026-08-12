import { useEffect, useRef, RefObject } from 'react';
import { getFocusableElements } from '@/lib/utils/focusHelper';

interface UseFocusTrapOptions {
  isActive: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapTab?: boolean;
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  {
    isActive,
    autoFocus = true,
    restoreFocus = true,
    trapTab = false,
  }: UseFocusTrapOptions
): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // 자동으로 포커스를 설정하고, 컴포넌트가 언마운트될 때 이전에 포커스된 요소로 복원하는 로직
  useEffect(() => {
    if (!isActive) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    if (autoFocus && containerRef.current) {
      const focusable = getFocusableElements(containerRef.current);
      focusable[0]?.focus();
    }

    return () => {
      if (restoreFocus && previouslyFocusedRef.current) {
        if (document.body.contains(previouslyFocusedRef.current)) {
          previouslyFocusedRef.current.focus();
        }
      }
    };
  }, [isActive, autoFocus, restoreFocus, containerRef]);

  // Tab 키를 트랩하는 로직
  useEffect(() => {
    if (!isActive || !trapTab) return;
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive, trapTab, containerRef]);
}
