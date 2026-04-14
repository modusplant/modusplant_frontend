import { useCallback, useRef, useState } from 'react';

interface UseDnDOptions {
  disabled?: boolean;
  onDropFiles?: (files: FileList) => void;
}

type DragEventHandler = (e: React.DragEvent<HTMLElement>) => void;

export const useDnD = ({ disabled = false, onDropFiles }: UseDnDOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepthRef = useRef(0);

  const clearDragState = useCallback(() => {
    dragDepthRef.current = 0;
    setIsDragging(false);
  }, []);

  const handleDragEnter: DragEventHandler = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();

      dragDepthRef.current += 1;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragOver: DragEventHandler = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    [disabled]
  );

  const handleDragLeave: DragEventHandler = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) {
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDrop: DragEventHandler = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();

      const files = e.dataTransfer.files;
      clearDragState();

      if (!files || files.length === 0) return;
      onDropFiles?.(files);
    },
    [clearDragState, disabled, onDropFiles]
  );

  return {
    isDragging,
    clearDragState,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
