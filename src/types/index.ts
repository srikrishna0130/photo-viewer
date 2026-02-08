/**
 * Core type definitions for the Photo Viewer application
 */

/**
 * Represents a single image file with metadata
 */
export interface ImageFile {
  /** Unique identifier for the image */
  id: string;
  /** File name with extension */
  name: string;
  /** Full path relative to root directory */
  path: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp */
  lastModified: number;
  /** File handle from File System Access API */
  handle: FileSystemFileHandle;
  /** Parent folder path */
  folderPath: string;
}

/**
 * Represents a folder node in the directory tree
 */
export interface FolderNode {
  /** Unique identifier for the folder */
  id: string;
  /** Folder name */
  name: string;
  /** Full path relative to root directory */
  path: string;
  /** Child folders */
  children: FolderNode[];
  /** Images in this folder */
  images: ImageFile[];
  /** Whether this node is expanded in the UI */
  isExpanded: boolean;
}

/**
 * Supported image file extensions
 */
export const IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.tiff',
  '.tif',
  '.heic',
  '.heif',
] as const;

export type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];

/**
 * Application state for directory scanning
 */
export interface ScanState {
  isScanning: boolean;
  progress: number;
  totalFiles: number;
  error: string | null;
}
