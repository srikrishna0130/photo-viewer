import { useEffect, useCallback } from 'react';

interface KeyboardActions {
  onLeft?: () => void;
  onRight?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onRotateRight?: () => void;
  enabled?: boolean;
}

/**
 * Hook to handle keyboard navigation events
 * Registers and cleans up keyboard event listeners
 *
 * @param actions - Callbacks for specific key presses
 * @example
 * useKeyboard({
 *   onLeft: () => prevImage(),
 *   onRight: () => nextImage(),
 *   onEscape: () => closeViewer(),
 *   enabled: isViewerOpen,
 * });
 */
export function useKeyboard(actions: KeyboardActions): void {
  const { onLeft, onRight, onEscape, onEnter, onRotateRight, enabled = true } = actions;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onRight?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;
        case 'r':
          event.preventDefault();
          onRotateRight?.();
          break;
      }
    },
    [onLeft, onRight, onEscape, onEnter, onRotateRight, enabled]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
