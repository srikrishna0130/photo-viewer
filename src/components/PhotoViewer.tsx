import React, { useState, useEffect, useCallback } from 'react';
import type { ImageFile } from '../types';
import { useKeyboard } from '../hooks/useKeyboard';
import { loadImageFromHandle, revokeImageUrl } from '../utils/imageLoader';
import { formatFileSize } from '../utils/fileFilters';

interface PhotoViewerProps {
  images: ImageFile[];
  initialIndex: number;
  onClose: () => void;
}

/**
 * PhotoViewer - Fullscreen modal for viewing photos
 * Supports keyboard navigation (Left/Right/ESC) and mouse controls
 */
export default function PhotoViewer({
  images,
  initialIndex,
  onClose,
}: PhotoViewerProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : i));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  useKeyboard({
    onLeft: goPrev,
    onRight: goNext,
    onEscape: onClose,
    enabled: true,
  });

  // Load full-resolution image when index changes
  useEffect(() => {
    if (!currentImage) return;

    let revoked = false;
    setIsLoading(true);

    loadImageFromHandle(currentImage.handle)
      .then((url) => {
        if (!revoked) {
          setImageUrl((prev) => {
            if (prev) revokeImageUrl(prev);
            return url;
          });
          setIsLoading(false);
        } else {
          revokeImageUrl(url);
        }
      })
      .catch(() => {
        if (!revoked) setIsLoading(false);
      });

    return () => {
      revoked = true;
    };
  }, [currentImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) revokeImageUrl(imageUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentImage) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      role="dialog"
      aria-label="Photo viewer"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentImage.name}</p>
          <p className="text-xs text-gray-400">
            {formatFileSize(currentImage.size)} · {currentIndex + 1} of{' '}
            {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close viewer"
          title="Close (ESC)"
        >
          ✕
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16">
        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
            aria-label="Previous image"
            title="Previous (←)"
          >
            ‹
          </button>
        )}

        {/* Image */}
        {isLoading ? (
          <div className="w-12 h-12 border-3 border-gray-600 border-t-white rounded-full animate-spin" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={currentImage.name}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        ) : (
          <div className="text-gray-400 text-center">
            <span className="text-4xl block mb-2">⚠️</span>
            <p>Failed to load image</p>
          </div>
        )}

        {/* Next button */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
            aria-label="Next image"
            title="Next (→)"
          >
            ›
          </button>
        )}
      </div>

      {/* Footer with keyboard hints */}
      <div className="flex justify-center gap-4 py-2 text-xs text-gray-500">
        <span>← → Navigate</span>
        <span>ESC Close</span>
      </div>
    </div>
  );
}
