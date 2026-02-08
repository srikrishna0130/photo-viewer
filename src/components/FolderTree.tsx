import React from 'react';
import type { FolderNode } from '../types';
import FolderItem from './FolderItem';

interface FolderTreeProps {
  tree: FolderNode;
  selectedPath: string | null;
  onSelectFolder: (node: FolderNode) => void;
  onToggleFolder: (node: FolderNode) => void;
}

/**
 * FolderTree - Sidebar component showing directory hierarchy
 * Wraps FolderItem for recursive rendering with scroll support
 */
export default function FolderTree({
  tree,
  selectedPath,
  onSelectFolder,
  onToggleFolder,
}: FolderTreeProps): React.ReactElement {
  return (
    <aside className="w-64 min-w-[200px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Folders
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-1" aria-label="Folder navigation">
        <FolderItem
          node={tree}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelectFolder}
          onToggle={onToggleFolder}
        />
      </nav>
    </aside>
  );
}
