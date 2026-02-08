import { describe, it, expect } from 'vitest';
import { sortImages } from './imageLoader';
import type { ImageFile } from '../types';

function makeImage(
  name: string,
  size: number,
  lastModified: number
): ImageFile {
  return {
    id: `test_${name}`,
    name,
    path: `/test/${name}`,
    size,
    lastModified,
    handle: {} as FileSystemFileHandle,
    folderPath: '/test',
  };
}

describe('sortImages', () => {
  const images = [
    makeImage('charlie.jpg', 3000, 300),
    makeImage('alpha.jpg', 1000, 100),
    makeImage('bravo.jpg', 2000, 200),
  ];

  it('sorts by name ascending', () => {
    const sorted = sortImages(images, 'name', true);
    expect(sorted.map((i) => i.name)).toEqual([
      'alpha.jpg',
      'bravo.jpg',
      'charlie.jpg',
    ]);
  });

  it('sorts by name descending', () => {
    const sorted = sortImages(images, 'name', false);
    expect(sorted.map((i) => i.name)).toEqual([
      'charlie.jpg',
      'bravo.jpg',
      'alpha.jpg',
    ]);
  });

  it('sorts by size ascending', () => {
    const sorted = sortImages(images, 'size', true);
    expect(sorted.map((i) => i.size)).toEqual([1000, 2000, 3000]);
  });

  it('sorts by date ascending', () => {
    const sorted = sortImages(images, 'date', true);
    expect(sorted.map((i) => i.lastModified)).toEqual([100, 200, 300]);
  });

  it('does not mutate original array', () => {
    const original = [...images];
    sortImages(images, 'name');
    expect(images).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortImages([], 'name')).toEqual([]);
  });
});
