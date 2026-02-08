/**
 * Photo Viewer Library Entry Point
 *
 * Re-exports all public components, hooks, utilities, services, and types
 * for consumption by downstream applications (e.g., album-selector).
 */

// Components
export { default as FolderTree } from '../components/FolderTree';
export { default as FolderItem } from '../components/FolderItem';
export { default as PhotoGrid } from '../components/PhotoGrid';
export { default as PhotoThumbnail } from '../components/PhotoThumbnail';
export { default as PhotoViewer } from '../components/PhotoViewer';

// Hooks
export { useFileSystem } from '../hooks/useFileSystem';
export { useImageCache } from '../hooks/useImageCache';
export { useKeyboard } from '../hooks/useKeyboard';

// Services
export {
  isFileSystemAccessSupported,
  selectDirectory,
  scanDirectoryRecursively,
  selectDirectoryFallback,
} from '../services/fileService';

// Utilities
export {
  buildFolderTree,
  countImagesInSubtree,
  collectAllImages,
} from '../utils/treeBuilder';
export {
  loadImageFromHandle,
  loadThumbnail,
  loadThumbnailFast,
  revokeImageUrl,
  getImageDimensions,
  sortImages,
} from '../utils/imageLoader';
export { createLoadQueue, thumbnailQueue } from '../utils/loadQueue';
export {
  getFileExtension,
  isImageFile,
  formatFileSize,
  generateId,
} from '../utils/fileFilters';

// Types
export type { ImageFile, FolderNode, ScanState, ImageExtension } from '../types';
export { IMAGE_EXTENSIONS } from '../types';
