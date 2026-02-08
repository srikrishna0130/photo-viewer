import { useEffect, useCallback } from 'react';

interface KeyboardActions {
  onLeft?: () => void;
  onRight?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
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
  const { onLeft, onRight, onEscape, onEnter, enabled = true } = actions;

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
      }
    },
    [onLeft, onRight, onEscape, onEnter, enabled]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
