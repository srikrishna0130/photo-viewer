import type { ImageFile, FolderNode } from '../types';
import { generateId } from './fileFilters';

/**
 * Builds a folder tree hierarchy from a flat list of image files
 * @param images - Flat array of image files with folder paths
 * @param rootName - Name for the root folder node
 * @returns Root FolderNode with nested children and images
 */
export function buildFolderTree(
  images: ImageFile[],
  rootName: string = 'Root'
): FolderNode {
  const root: FolderNode = {
    id: generateId(rootName),
    name: rootName,
    path: rootName,
    children: [],
    images: [],
    isExpanded: true,
  };

  const folderMap = new Map<string, FolderNode>();
  folderMap.set(rootName, root);

  for (const image of images) {
    const folderNode = getOrCreateFolder(folderMap, image.folderPath, root);
    folderNode.images.push(image);
  }

  return root;
}

/**
 * Gets an existing folder node or creates the path to it
 * @param folderMap - Map of path -> FolderNode for quick lookup
 * @param folderPath - Full path of the folder to find/create
 * @param root - Root node of the tree
 * @returns The FolderNode at the specified path
 */
function getOrCreateFolder(
  folderMap: Map<string, FolderNode>,
  folderPath: string,
  root: FolderNode
): FolderNode {
  const existing = folderMap.get(folderPath);
  if (existing) return existing;

  const parts = folderPath.split('/');
  let current = root;

  for (let i = 1; i < parts.length; i++) {
    const partialPath = parts.slice(0, i + 1).join('/');
    const partName = parts[i];

    let child = folderMap.get(partialPath);
    if (!child && partName) {
      child = {
        id: generateId(partialPath),
        name: partName,
        path: partialPath,
        children: [],
        images: [],
        isExpanded: false,
      };
      current.children.push(child);
      folderMap.set(partialPath, child);
    }
    if (child) current = child;
  }

  return current;
}

/**
 * Counts total images in a folder and all its descendants
 * @param node - The folder node to count images for
 * @returns Total number of images in the subtree
 */
export function countImagesInSubtree(node: FolderNode): number {
  let count = node.images.length;
  for (const child of node.children) {
    count += countImagesInSubtree(child);
  }
  return count;
}

/**
 * Collects all images from a folder and its descendants
 * @param node - The folder node to collect images from
 * @returns Flat array of all images in the subtree
 */
export function collectAllImages(node: FolderNode): ImageFile[] {
  const images = [...node.images];
  for (const child of node.children) {
    images.push(...collectAllImages(child));
  }
  return images;
}
