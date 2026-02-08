import type { ImageFile } from '../types';
import { isImageFile, generateId } from '../utils/fileFilters';

/**
 * Checks if File System Access API is available in the browser
 * @returns true if the API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window;
}

/**
 * Opens a directory picker dialog and returns the directory handle
 * @returns The selected directory handle
 * @throws {AbortError} If user cancels the dialog
 */
export async function selectDirectory(): Promise<FileSystemDirectoryHandle> {
  return await window.showDirectoryPicker({ mode: 'read' });
}

/**
 * Scans a directory recursively and returns all image files
 * @param dirHandle - Directory handle from File System Access API
 * @param basePath - Current path relative to root (used for recursion)
 * @returns Array of ImageFile metadata objects
 */
export async function scanDirectoryRecursively(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string = ''
): Promise<ImageFile[]> {
  const images: ImageFile[] = [];
  const currentPath = basePath
    ? `${basePath}/${dirHandle.name}`
    : dirHandle.name;

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file' && isImageFile(entry.name)) {
      const file = await entry.getFile();
      images.push({
        id: generateId(`${currentPath}/${entry.name}`),
        name: entry.name,
        path: `${currentPath}/${entry.name}`,
        size: file.size,
        lastModified: file.lastModified,
        handle: entry,
        folderPath: currentPath,
      });
    } else if (entry.kind === 'directory') {
      const childImages = await scanDirectoryRecursively(entry, currentPath);
      images.push(...childImages);
    }
  }

  return images;
}
