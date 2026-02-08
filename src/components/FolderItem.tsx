import React, { memo } from 'react';
import type { FolderNode } from '../types';
import { countImagesInSubtree } from '../utils/treeBuilder';

interface FolderItemProps {
  node: FolderNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FolderNode) => void;
  onToggle: (node: FolderNode) => void;
}

/**
 * FolderItem - Renders a single folder node in the tree
 * Displays folder name, image count, and expand/collapse toggle
 */
const FolderItem = memo(function FolderItem({
  node,
  depth,
  selectedPath,
  onSelect,
  onToggle,
}: FolderItemProps): React.ReactElement {
  const imageCount = countImagesInSubtree(node);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        className={`flex items-center w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 transition-colors rounded ${
          isSelected ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
        title={node.path}
      >
        {hasChildren ? (
          <span
            className="mr-1 cursor-pointer select-none w-4 text-center text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node);
            }}
          >
            {node.isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span className="mr-1 w-4" />
        )}
        <span className="mr-1.5">📁</span>
        <span className="truncate flex-1">{node.name}</span>
        {imageCount > 0 && (
          <span className="text-xs text-gray-400 ml-2">{imageCount}</span>
        )}
      </button>

      {node.isExpanded &&
        node.children.map((child) => (
          <FolderItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
    </div>
  );
});

export default FolderItem;
