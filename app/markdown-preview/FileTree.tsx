import React, { useState } from 'react'
import { FileNode } from '@/app/api/files/route'

interface FileTreeProps {
  tree: FileNode[]
  onFileSelect: (path: string) => void
  selectedFile: string | null
}

interface FileTreeNodeProps {
  node: FileNode
  onFileSelect: (path: string) => void
  selectedFile: string | null
  level: number
  expandedFolders: Set<string>
  toggleFolder: (path: string) => void
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  onFileSelect,
  selectedFile,
  level,
  expandedFolders,
  toggleFolder
}) => {
  const isExpanded = expandedFolders.has(node.path)
  const isSelected = selectedFile === node.path
  const indent = level * 16

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => toggleFolder(node.path)}
          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          <span className="mr-2 text-gray-600 select-none w-4">
            {isExpanded ? '▼' : '▶'}
          </span>
          <span className="font-medium text-gray-700">{node.name}</span>
        </div>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                level={level + 1}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={() => onFileSelect(node.path)}
      className={`flex items-center p-2 cursor-pointer rounded transition-all
        ${isSelected 
          ? 'bg-purple-600 text-white hover:bg-purple-700' 
          : 'hover:bg-gray-100'
        }`}
      style={{ paddingLeft: `${indent + 24}px` }}
    >
      <span className={`text-sm break-words ${isSelected ? 'text-white' : 'text-gray-600'}`}>
        {node.name}
      </span>
    </div>
  )
}

const FileTree: React.FC<FileTreeProps> = ({ tree, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  if (!tree || tree.length === 0) {
    return <p className="text-gray-500">No markdown files found</p>
  }

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          level={0}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
        />
      ))}
    </div>
  )
}

export default FileTree
