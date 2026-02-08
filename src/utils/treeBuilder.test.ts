import { describe, it, expect } from 'vitest';
import {
  buildFolderTree,
  countImagesInSubtree,
  collectAllImages,
} from './treeBuilder';
import type { ImageFile } from '../types';

/** Helper to create a minimal ImageFile for testing */
function makeImage(name: string, folderPath: string): ImageFile {
  return {
    id: `test_${name}`,
    name,
    path: `${folderPath}/${name}`,
    size: 1000,
    lastModified: Date.now(),
    handle: {} as FileSystemFileHandle,
    folderPath,
  };
}

describe('buildFolderTree', () => {
  it('creates a root node with correct name', () => {
    const tree = buildFolderTree([], 'Photos');
    expect(tree.name).toBe('Photos');
    expect(tree.children).toHaveLength(0);
    expect(tree.images).toHaveLength(0);
  });

  it('places images in correct folders', () => {
    const images = [
      makeImage('a.jpg', 'Root/folder1'),
      makeImage('b.jpg', 'Root/folder1'),
      makeImage('c.jpg', 'Root/folder2'),
    ];
    const tree = buildFolderTree(images, 'Root');

    expect(tree.children).toHaveLength(2);

    const folder1 = tree.children.find((c) => c.name === 'folder1');
    const folder2 = tree.children.find((c) => c.name === 'folder2');
    expect(folder1?.images).toHaveLength(2);
    expect(folder2?.images).toHaveLength(1);
  });

  it('handles deeply nested folders', () => {
    const images = [makeImage('deep.jpg', 'Root/a/b/c')];
    const tree = buildFolderTree(images, 'Root');

    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]?.name).toBe('a');
    expect(tree.children[0]?.children[0]?.name).toBe('b');
    expect(tree.children[0]?.children[0]?.children[0]?.name).toBe('c');
    expect(
      tree.children[0]?.children[0]?.children[0]?.images
    ).toHaveLength(1);
  });

  it('handles images in root folder', () => {
    const images = [makeImage('root.jpg', 'Root')];
    const tree = buildFolderTree(images, 'Root');

    expect(tree.images).toHaveLength(1);
    expect(tree.children).toHaveLength(0);
  });

  it('handles empty input', () => {
    const tree = buildFolderTree([]);
    expect(tree.children).toHaveLength(0);
    expect(tree.images).toHaveLength(0);
    expect(tree.isExpanded).toBe(true);
  });

  it('creates shared parent folders correctly', () => {
    const images = [
      makeImage('a.jpg', 'Root/parent/child1'),
      makeImage('b.jpg', 'Root/parent/child2'),
    ];
    const tree = buildFolderTree(images, 'Root');

    expect(tree.children).toHaveLength(1);
    const parent = tree.children[0];
    expect(parent?.name).toBe('parent');
    expect(parent?.children).toHaveLength(2);
  });
});

describe('countImagesInSubtree', () => {
  it('counts images recursively', () => {
    const images = [
      makeImage('a.jpg', 'Root/folder1'),
      makeImage('b.jpg', 'Root/folder1/sub'),
      makeImage('c.jpg', 'Root/folder2'),
    ];
    const tree = buildFolderTree(images, 'Root');
    expect(countImagesInSubtree(tree)).toBe(3);
  });

  it('returns 0 for empty tree', () => {
    const tree = buildFolderTree([]);
    expect(countImagesInSubtree(tree)).toBe(0);
  });
});

describe('collectAllImages', () => {
  it('collects all images from subtree', () => {
    const images = [
      makeImage('a.jpg', 'Root/folder1'),
      makeImage('b.jpg', 'Root/folder1/sub'),
    ];
    const tree = buildFolderTree(images, 'Root');
    const all = collectAllImages(tree);
    expect(all).toHaveLength(2);
    expect(all.map((i) => i.name)).toContain('a.jpg');
    expect(all.map((i) => i.name)).toContain('b.jpg');
  });
});
