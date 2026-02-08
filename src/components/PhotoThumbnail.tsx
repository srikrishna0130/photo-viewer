import React, { memo, useState, useEffect, useRef } from 'react';
import type { ImageFile } from '../types';
import { loadThumbnail, revokeImageUrl } from '../utils/imageLoader';

interface PhotoThumbnailProps {
  image: ImageFile;
  onClick: (image: ImageFile) => void;
  cachedUrl?: string;
  onLoad?: (id: string, url: string) => void;
}

/**
 * PhotoThumbnail - Displays a single photo thumbnail with lazy loading
 * Uses Intersection Observer for viewport-based loading
 */
const PhotoThumbnail = memo(function PhotoThumbnail({
  image,
  onClick,
  cachedUrl,
  onLoad,
}: PhotoThumbnailProps): React.ReactElement {
  const [url, setUrl] = useState<string | null>(cachedUrl ?? null);
  const [isLoading, setIsLoading] = useState(!cachedUrl);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(!!cachedUrl);

  useEffect(() => {
    if (hasLoadedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          hasLoadedRef.current = true;
          observer.disconnect();

          loadThumbnail(image.handle)
            .then((thumbUrl) => {
              setUrl(thumbUrl);
              setIsLoading(false);
              onLoad?.(image.id, thumbUrl);
            })
            .catch(() => {
              setError(true);
              setIsLoading(false);
            });
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [image.handle, image.id, onLoad]);

  // Cleanup non-cached URLs on unmount
  useEffect(() => {
    return () => {
      if (url && !cachedUrl) revokeImageUrl(url);
    };
  }, [url, cachedUrl]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-400 transition-all"
      onClick={() => onClick(image)}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(image)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <span className="text-2xl">⚠️</span>
          <span className="text-xs mt-1">Failed</span>
        </div>
      )}

      {url && (
        <img
          src={url}
          alt={image.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs truncate">{image.name}</p>
      </div>
    </div>
  );
});

export default PhotoThumbnail;
