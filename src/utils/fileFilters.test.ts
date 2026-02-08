import { describe, it, expect } from 'vitest';
import {
  isImageFile,
  getFileExtension,
  formatFileSize,
  generateId,
} from './fileFilters';

describe('getFileExtension', () => {
  it('returns lowercase extension with dot', () => {
    expect(getFileExtension('photo.JPG')).toBe('.jpg');
    expect(getFileExtension('image.png')).toBe('.png');
  });

  it('handles multiple dots in filename', () => {
    expect(getFileExtension('my.photo.jpg')).toBe('.jpg');
  });

  it('returns empty string for no extension', () => {
    expect(getFileExtension('README')).toBe('');
  });

  it('handles empty string', () => {
    expect(getFileExtension('')).toBe('');
  });
});

describe('isImageFile', () => {
  it('accepts common image formats', () => {
    expect(isImageFile('photo.jpg')).toBe(true);
    expect(isImageFile('photo.jpeg')).toBe(true);
    expect(isImageFile('photo.png')).toBe(true);
    expect(isImageFile('photo.gif')).toBe(true);
    expect(isImageFile('photo.webp')).toBe(true);
    expect(isImageFile('photo.bmp')).toBe(true);
    expect(isImageFile('photo.svg')).toBe(true);
  });

  it('accepts case-insensitive extensions', () => {
    expect(isImageFile('photo.JPG')).toBe(true);
    expect(isImageFile('photo.PNG')).toBe(true);
    expect(isImageFile('photo.Gif')).toBe(true);
  });

  it('accepts TIFF formats', () => {
    expect(isImageFile('photo.tiff')).toBe(true);
    expect(isImageFile('photo.tif')).toBe(true);
  });

  it('accepts HEIC/HEIF formats', () => {
    expect(isImageFile('photo.heic')).toBe(true);
    expect(isImageFile('photo.heif')).toBe(true);
  });

  it('rejects non-image files', () => {
    expect(isImageFile('doc.pdf')).toBe(false);
    expect(isImageFile('file.txt')).toBe(false);
    expect(isImageFile('video.mp4')).toBe(false);
    expect(isImageFile('music.mp3')).toBe(false);
    expect(isImageFile('data.json')).toBe(false);
    expect(isImageFile('script.js')).toBe(false);
  });

  it('rejects files without extension', () => {
    expect(isImageFile('README')).toBe(false);
    expect(isImageFile('Makefile')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(isImageFile('')).toBe(false);
    expect(isImageFile('.jpg')).toBe(true);
    expect(isImageFile('folder/photo.jpg')).toBe(true);
  });
});

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(5242880)).toBe('5.0 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });
});

describe('generateId', () => {
  it('generates consistent IDs for same path', () => {
    const id1 = generateId('/folder/image.jpg');
    const id2 = generateId('/folder/image.jpg');
    expect(id1).toBe(id2);
  });

  it('generates different IDs for different paths', () => {
    const id1 = generateId('/folder1/image.jpg');
    const id2 = generateId('/folder2/image.jpg');
    expect(id1).not.toBe(id2);
  });

  it('returns string starting with id_', () => {
    const id = generateId('test');
    expect(id).toMatch(/^id_/);
  });
});
