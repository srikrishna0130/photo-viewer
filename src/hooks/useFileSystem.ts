import { useState, useCallback } from 'react';
import type { ImageFile, FolderNode, ScanState } from '../types';
import {
  isFileSystemAccessSupported,
  selectDirectory,
  scanDirectoryRecursively,
  selectDirectoryFallback,
} from '../services/fileService';
import { buildFolderTree } from '../utils/treeBuilder';

interface UseFileSystemReturn {
  folderTree: FolderNode | null;
  allImages: ImageFile[];
  scanState: ScanState;
  openDirectory: () => Promise<void>;
  isSupported: boolean;
}

/**
 * Hook to manage directory selection and file scanning.
 * Uses File System Access API in Chrome/Edge, falls back to
 * <input webkitdirectory> for Firefox and other browsers.
 */
export function useFileSystem(): UseFileSystemReturn {
  const [folderTree, setFolderTree] = useState<FolderNode | null>(null);
  const [allImages, setAllImages] = useState<ImageFile[]>([]);
  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    progress: 0,
    totalFiles: 0,
    error: null,
  });

  // Always supported: either native API or fallback
  const isSupported = true;
  const hasNativeApi = isFileSystemAccessSupported();

  const openDirectory = useCallback(async () => {
    try {
      setScanState({
        isScanning: true,
        progress: 0,
        totalFiles: 0,
        error: null,
      });

      let images: ImageFile[];
      let rootName: string;

      if (hasNativeApi) {
        // Chrome/Edge: use File System Access API
        const dirHandle = await selectDirectory();
        rootName = dirHandle.name;
        images = await scanDirectoryRecursively(dirHandle);
      } else {
        // Firefox/Safari: use <input webkitdirectory> fallback
        const result = await selectDirectoryFallback();
        rootName = result.name;
        images = result.images;
      }

      const tree = buildFolderTree(images, rootName);
      setAllImages(images);
      setFolderTree(tree);
      setScanState({
        isScanning: false,
        progress: 100,
        totalFiles: images.length,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'AbortError'
          ? null // User cancelled - not an error
          : err instanceof Error
            ? err.message
            : 'An unknown error occurred';

      setScanState((prev) => ({
        ...prev,
        isScanning: false,
        error: message,
      }));
    }
  }, [hasNativeApi]);

  return { folderTree, allImages, scanState, openDirectory, isSupported };
}
