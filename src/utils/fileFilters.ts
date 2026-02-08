import { IMAGE_EXTENSIONS, type ImageExtension } from '../types';

/**
 * Extracts the file extension from a filename (lowercase, with dot)
 * @param filename - The filename to extract extension from
 * @returns Lowercase extension with dot (e.g., '.jpg')
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Checks if a filename has a supported image extension
 * @param filename - The filename to check
 * @returns true if the file is a supported image format
 */
export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return IMAGE_EXTENSIONS.includes(ext as ImageExtension);
}

/**
 * Formats file size in human-readable form
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., '1.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i] ?? 'GB'}`;
}

/**
 * Generates a unique ID from a file path
 * @param path - The file or folder path
 * @returns A stable, unique identifier string
 */
export function generateId(path: string): string {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    const char = path.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `id_${Math.abs(hash).toString(36)}`;
}
