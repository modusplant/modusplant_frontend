import { useEffect, useRef } from 'react';

const escapeStack: symbol[] = [];

export function useEscapeKey(onEscape: () => void, enabled = true): void {
  const onEscapeRef = useRef(onEscape);
  const idRef = useRef(Symbol());

  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!enabled) return;
    const id = idRef.current;
    escapeStack.push(id);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (escapeStack[escapeStack.length - 1] !== idRef.current) return;
      onEscapeRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      escapeStack.splice(escapeStack.indexOf(id), 1);
    };
  }, [enabled]);
}
