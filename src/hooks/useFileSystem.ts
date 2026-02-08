import { useState, useCallback } from 'react';
import type { ImageFile, FolderNode, ScanState } from '../types';
import {
  isFileSystemAccessSupported,
  selectDirectory,
  scanDirectoryRecursively,
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
 * Hook to manage directory selection and file scanning
 * Provides folder tree data and scan state
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

  const isSupported = isFileSystemAccessSupported();

  const openDirectory = useCallback(async () => {
    if (!isSupported) {
      setScanState((prev) => ({
        ...prev,
        error: 'File System Access API is not supported in this browser.',
      }));
      return;
    }

    try {
      setScanState({
        isScanning: true,
        progress: 0,
        totalFiles: 0,
        error: null,
      });

      const dirHandle = await selectDirectory();
      const images = await scanDirectoryRecursively(dirHandle);
      const tree = buildFolderTree(images, dirHandle.name);

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
  }, [isSupported]);

  return { folderTree, allImages, scanState, openDirectory, isSupported };
}
