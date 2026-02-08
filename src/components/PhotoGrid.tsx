import React, { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ImageFile } from '../types';
import PhotoThumbnail from './PhotoThumbnail';
import { useImageCache } from '../hooks/useImageCache';

interface PhotoGridProps {
  images: ImageFile[];
  onImageClick: (image: ImageFile) => void;
}

const COLUMN_COUNT = 5;
const GAP = 8;

/**
 * PhotoGrid - Virtualized grid of photo thumbnails
 * Uses TanStack Virtual for efficient rendering of large collections
 *
 * @example
 * <PhotoGrid images={images} onImageClick={handleClick} />
 */
export default function PhotoGrid({
  images,
  onImageClick,
}: PhotoGridProps): React.ReactElement {
  const parentRef = useRef<HTMLDivElement>(null);
  const { getCachedUrl, setCachedUrl } = useImageCache();

  const rowCount = Math.ceil(images.length / COLUMN_COUNT);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 3,
  });

  const handleThumbnailLoad = useCallback(
    (id: string, url: string) => {
      setCachedUrl(id, url);
    },
    [setCachedUrl]
  );

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <span className="text-4xl block mb-2">🖼️</span>
          <p>No images in this folder</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-auto p-4">
      <p className="text-sm text-gray-500 mb-3">
        {images.length} {images.length === 1 ? 'image' : 'images'}
      </p>
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * COLUMN_COUNT;
          const rowImages = images.slice(startIndex, startIndex + COLUMN_COUNT);

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid h-full"
                style={{
                  gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
                  gap: `${GAP}px`,
                }}
              >
                {rowImages.map((image) => (
                  <PhotoThumbnail
                    key={image.id}
                    image={image}
                    onClick={onImageClick}
                    cachedUrl={getCachedUrl(image.id)}
                    onLoad={handleThumbnailLoad}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
