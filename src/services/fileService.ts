import type { ImageFile } from '../types';
import { isImageFile, generateId } from '../utils/fileFilters';

/**
 * Checks if File System Access API is available in the browser
 * @returns true if the API is supported (Chrome/Edge)
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
 * Uses File System Access API (Chrome/Edge only)
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

/**
 * Fallback directory selection using <input webkitdirectory>.
 * Works in Firefox, Safari, and all modern browsers.
 * @returns Promise resolving to { name, images } with root folder name and images
 */
export function selectDirectoryFallback(): Promise<{
  name: string;
  images: ImageFile[];
}> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.multiple = true;

    input.addEventListener('change', () => {
      const files = input.files;
      if (!files || files.length === 0) {
        reject(new DOMException('No files selected', 'AbortError'));
        return;
      }

      const { rootName, images } = processFileList(files);
      resolve({ name: rootName, images });
    });

    input.addEventListener('cancel', () => {
      reject(new DOMException('User cancelled', 'AbortError'));
    });

    input.click();
  });
}

/**
 * Processes a FileList from an input element into ImageFile array.
 * Extracts folder structure from webkitRelativePath.
 * @param files - FileList from the input element
 * @returns Root folder name and array of ImageFile objects
 */
function processFileList(files: FileList): {
  rootName: string;
  images: ImageFile[];
} {
  const images: ImageFile[] = [];
  let rootName = 'Photos';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || !isImageFile(file.name)) continue;

    const relativePath = file.webkitRelativePath || file.name;
    const parts = relativePath.split('/');

    // First part of the path is the root folder name
    if (parts[0] && rootName === 'Photos') {
      rootName = parts[0];
    }

    // Build folder path from relative path (exclude filename)
    const folderPath = parts.slice(0, -1).join('/') || rootName;

    images.push({
      id: generateId(relativePath),
      name: file.name,
      path: relativePath,
      size: file.size,
      lastModified: file.lastModified,
      handle: file, // Store raw File for Firefox
      folderPath,
    });
  }

  return { rootName, images };
}
