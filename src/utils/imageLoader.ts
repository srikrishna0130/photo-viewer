import type { ImageFile } from '../types';
import { thumbnailQueue } from './loadQueue';

/**
 * Resolves a handle (FileSystemFileHandle or raw File) to a File object
 * @param handle - FileSystemFileHandle or File
 * @returns The File object
 */
async function resolveFile(
  handle: FileSystemFileHandle | File
): Promise<File> {
  if (handle instanceof File) return handle;
  return await handle.getFile();
}

/**
 * Creates an object URL for an image file handle
 * @param handle - FileSystemFileHandle or File to load
 * @returns Object URL string for displaying the image
 */
export async function loadImageFromHandle(
  handle: FileSystemFileHandle | File
): Promise<string> {
  const file = await resolveFile(handle);
  return URL.createObjectURL(file);
}

/**
 * Fast thumbnail loader — creates a direct blob URL from the file.
 * Skips the expensive createImageBitmap → canvas → JPEG re-encode pipeline.
 * Lets the browser's <img> element handle native decode + resize via CSS.
 * Goes through a concurrency queue to prevent I/O thrashing.
 * @param handle - FileSystemFileHandle or File to load
 * @returns Object URL for displaying as a thumbnail
 */
export async function loadThumbnailFast(
  handle: FileSystemFileHandle | File
): Promise<string> {
  return thumbnailQueue.enqueue(async () => {
    const file = await resolveFile(handle);
    return URL.createObjectURL(file);
  });
}

/**
 * Loads a thumbnail-sized version of an image for grid display
 * Uses createImageBitmap for explicit resizing (slower but smaller memory)
 * Prefer loadThumbnailFast for most use cases.
 * @param handle - FileSystemFileHandle or File to load
 * @param maxSize - Maximum width/height of thumbnail (default: 300)
 * @returns Object URL for the thumbnail
 */
export async function loadThumbnail(
  handle: FileSystemFileHandle | File,
  maxSize: number = 300
): Promise<string> {
  const file = await resolveFile(handle);
  const bitmap = await createImageBitmap(file, {
    resizeWidth: maxSize,
    resizeHeight: maxSize,
    resizeQuality: 'medium',
  });

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
  return URL.createObjectURL(blob);
}

/**
 * Revokes an object URL to free memory
 * Should be called when image is no longer displayed
 * @param url - Object URL to revoke
 */
export function revokeImageUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Gets image dimensions from a file handle
 * @param handle - FileSystemFileHandle or File to read dimensions from
 * @returns Width and height of the image
 */
export async function getImageDimensions(
  handle: FileSystemFileHandle | File
): Promise<{ width: number; height: number }> {
  const file = await resolveFile(handle);
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();
  return { width, height };
}

/**
 * Sorts images by name, date, or size
 * @param images - Array of images to sort
 * @param by - Sort field
 * @param ascending - Sort direction
 * @returns New sorted array (does not mutate original)
 */
export function sortImages(
  images: ImageFile[],
  by: 'name' | 'date' | 'size' = 'name',
  ascending: boolean = true
): ImageFile[] {
  const sorted = [...images].sort((a, b) => {
    switch (by) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return a.lastModified - b.lastModified;
      case 'size':
        return a.size - b.size;
    }
  });
  return ascending ? sorted : sorted.reverse();
}
