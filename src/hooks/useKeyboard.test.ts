import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';

function fireKey(key: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

describe('useKeyboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls onLeft when ArrowLeft is pressed', () => {
    const onLeft = vi.fn();
    renderHook(() => useKeyboard({ onLeft }));
    fireKey('ArrowLeft');
    expect(onLeft).toHaveBeenCalledOnce();
  });

  it('calls onRight when ArrowRight is pressed', () => {
    const onRight = vi.fn();
    renderHook(() => useKeyboard({ onRight }));
    fireKey('ArrowRight');
    expect(onRight).toHaveBeenCalledOnce();
  });

  it('calls onEscape when Escape is pressed', () => {
    const onEscape = vi.fn();
    renderHook(() => useKeyboard({ onEscape }));
    fireKey('Escape');
    expect(onEscape).toHaveBeenCalledOnce();
  });

  it('calls onEnter when Enter is pressed', () => {
    const onEnter = vi.fn();
    renderHook(() => useKeyboard({ onEnter }));
    fireKey('Enter');
    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('does not call handlers when disabled', () => {
    const onLeft = vi.fn();
    renderHook(() => useKeyboard({ onLeft, enabled: false }));
    fireKey('ArrowLeft');
    expect(onLeft).not.toHaveBeenCalled();
  });

  it('does not call handler for unregistered keys', () => {
    const onLeft = vi.fn();
    renderHook(() => useKeyboard({ onLeft }));
    fireKey('a');
    expect(onLeft).not.toHaveBeenCalled();
  });

  it('cleans up listeners on unmount', () => {
    const onLeft = vi.fn();
    const { unmount } = renderHook(() => useKeyboard({ onLeft }));
    unmount();
    fireKey('ArrowLeft');
    expect(onLeft).not.toHaveBeenCalled();
  });
});
