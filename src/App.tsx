/**
 * Main App Component
 *
 * Entry point for the Photo Viewer application.
 * Coordinates folder selection, tree navigation, grid display, and viewer.
 */
import React, { useState, useCallback } from 'react';
import { useFileSystem } from './hooks/useFileSystem';
import FolderTree from './components/FolderTree';
import PhotoGrid from './components/PhotoGrid';
import PhotoViewer from './components/PhotoViewer';
import { collectAllImages } from './utils/treeBuilder';
import type { FolderNode, ImageFile } from './types';

function App(): React.ReactElement {
  const { folderTree, scanState, openDirectory, isSupported } = useFileSystem();
  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null);
  const [viewerState, setViewerState] = useState<{
    images: ImageFile[];
    index: number;
  } | null>(null);

  // Get images for the currently selected folder
  const displayImages = selectedFolder
    ? collectAllImages(selectedFolder)
    : folderTree
      ? collectAllImages(folderTree)
      : [];

  const handleSelectFolder = useCallback((node: FolderNode) => {
    setSelectedFolder(node);
  }, []);

  const handleToggleFolder = useCallback((node: FolderNode) => {
    node.isExpanded = !node.isExpanded;
    // Force re-render by toggling selection
    setSelectedFolder((prev) => (prev === node ? { ...node } : prev));
  }, []);

  const handleImageClick = useCallback(
    (image: ImageFile) => {
      const index = displayImages.findIndex((i) => i.id === image.id);
      setViewerState({ images: displayImages, index: Math.max(0, index) });
    },
    [displayImages]
  );

  const handleCloseViewer = useCallback(() => {
    setViewerState(null);
  }, []);

  // Empty state - no folder selected yet
  if (!folderTree) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">📸</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Photo Viewer
          </h1>
          <p className="text-gray-500 mb-6">
            Browse and view your photos organized by folders. Select a directory
            to get started.
          </p>

          {!isSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm text-yellow-800">
              ⚠️ Your browser doesn&apos;t support the File System Access API.
              Please use Chrome or Edge.
            </div>
          )}

          {scanState.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">
              {scanState.error}
            </div>
          )}

          <button
            onClick={openDirectory}
            disabled={!isSupported || scanState.isScanning}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium shadow-md"
          >
            {scanState.isScanning ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning...
              </span>
            ) : (
              '📁 Select Folder'
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Supports JPG, PNG, GIF, WebP, BMP, SVG, TIFF, HEIC
          </p>
        </div>
      </div>
    );
  }

  // Main layout - folder tree + photo grid
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800">📸 Photo Viewer</h1>
          <span className="text-sm text-gray-400">
            {scanState.totalFiles} images found
          </span>
        </div>
        <button
          onClick={openDirectory}
          className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Change Folder
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        <FolderTree
          tree={folderTree}
          selectedPath={selectedFolder?.path ?? null}
          onSelectFolder={handleSelectFolder}
          onToggleFolder={handleToggleFolder}
        />
        <PhotoGrid images={displayImages} onImageClick={handleImageClick} />
      </div>

      {/* Fullscreen viewer modal */}
      {viewerState && (
        <PhotoViewer
          images={viewerState.images}
          initialIndex={viewerState.index}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}

export default App;

