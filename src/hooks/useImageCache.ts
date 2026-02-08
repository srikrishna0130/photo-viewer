import { useState, useCallback, useRef, useEffect } from 'react';
import { revokeImageUrl } from '../utils/imageLoader';

interface CacheEntry {
  url: string;
  lastAccessed: number;
}

interface UseImageCacheReturn {
  getCachedUrl: (id: string) => string | undefined;
  setCachedUrl: (id: string, url: string) => void;
  clearCache: () => void;
}

const MAX_CACHE_SIZE = 200;

/**
 * Hook for managing an in-memory LRU image URL cache
 * Automatically revokes old object URLs to prevent memory leaks
 */
export function useImageCache(): UseImageCacheReturn {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const [, setVersion] = useState(0);

  const evictOldest = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size <= MAX_CACHE_SIZE) return;

    const entries = Array.from(cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    const toEvict = entries.slice(0, cache.size - MAX_CACHE_SIZE);
    for (const [key, entry] of toEvict) {
      revokeImageUrl(entry.url);
      cache.delete(key);
    }
  }, []);

  const getCachedUrl = useCallback((id: string): string | undefined => {
    const entry = cacheRef.current.get(id);
    if (entry) {
      entry.lastAccessed = Date.now();
      return entry.url;
    }
    return undefined;
  }, []);

  const setCachedUrl = useCallback(
    (id: string, url: string) => {
      cacheRef.current.set(id, { url, lastAccessed: Date.now() });
      evictOldest();
      setVersion((v) => v + 1);
    },
    [evictOldest]
  );

  const clearCache = useCallback(() => {
    for (const entry of cacheRef.current.values()) {
      revokeImageUrl(entry.url);
    }
    cacheRef.current.clear();
    setVersion((v) => v + 1);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const entry of cacheRef.current.values()) {
        revokeImageUrl(entry.url);
      }
    };
  }, []);

  return { getCachedUrl, setCachedUrl, clearCache };
}
