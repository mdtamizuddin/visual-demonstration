'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FileJson,
  FileText,
  FilePlus,
  FolderPlus,
  RotateCw,
  MinusSquare,
  MoreHorizontal,
} from 'lucide-react';
import { FileTreeNode } from '@/data/demo-project';
import { ProjectFile } from '@/engine/demo-types';

interface ExplorerProps {
  fileTree: FileTreeNode[];
  files: Record<string, ProjectFile>;
  activeFile: string;
  onFileSelect: (path: string) => void;
}

export function Explorer({
  fileTree,
  files,
  activeFile,
  onFileSelect,
}: ExplorerProps) {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({
    'src/lib': true,
  });

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return (
        <span className="text-[#3178c6] text-[11px] font-bold font-mono px-0.5 select-none shrink-0">
          TS
        </span>
      );
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-[#cbcb41] shrink-0" />;
    }
    if (fileName.endsWith('.md')) {
      return <FileText className="w-3.5 h-3.5 text-[#519aba] shrink-0" />;
    }
    return <FileCode2 className="w-3.5 h-3.5 text-[#cccccc] shrink-0" />;
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isFolder = node.isFolder;
    const isCollapsed = collapsedFolders[node.id];
    const isSelected = activeFile === node.path;
    const currentFile = files[node.path];
    const gitStatus = currentFile?.gitStatus || node.gitStatus || 'clean';

    if (isFolder) {
      return (
        <div key={node.id} className="select-none">
          <button
            onClick={() => toggleFolder(node.id)}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className="w-full flex items-center gap-1.5 py-1 text-xs text-[#cccccc] hover:bg-[#2a2d2e] transition-colors text-left"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-[#858585] shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#858585] shrink-0" />
            )}
            <span className="font-medium text-[#e1e1e1] truncate">{node.name}</span>
          </button>

          {!isCollapsed && node.children && (
            <div>
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={node.id}
        id={`file-${node.path}`}
        data-cursor-id={`file-${node.path}`}
        onClick={() => onFileSelect(node.path)}
        style={{ paddingLeft: `${depth * 12 + 18}px` }}
        className={`w-full flex items-center justify-between py-1 pr-2 text-xs transition-colors group text-left ${
          isSelected
            ? 'bg-[#37373d] text-white font-medium'
            : 'text-[#cccccc] hover:bg-[#2a2d2e]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {getFileIcon(node.name)}
          <span className="truncate">{node.name}</span>
        </div>

        {/* Git change indicator */}
        {gitStatus === 'untracked' && (
          <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-tight shrink-0">
            U
          </span>
        )}
        {gitStatus === 'modified' && (
          <span className="text-[10px] font-bold text-amber-400 font-mono tracking-tight shrink-0">
            M
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-60 bg-[#252526] flex flex-col h-full shrink-0 select-none border-r border-[#1e1e1e] overflow-hidden text-xs">
      {/* Explorer Title & Actions */}
      <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase border-b border-[#1e1e1e]/40">
        <span>Explorer</span>
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            id="explorer-new-file-btn"
            title="New File..."
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            title="New Folder..."
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            title="Refresh Explorer"
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            title="Collapse Folders in Explorer"
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors"
          >
            <MinusSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Root Section */}
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-[#c5c5c5] bg-[#1e1e1e]/60 cursor-pointer">
        <div className="flex items-center gap-1 truncate">
          <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
          <span className="uppercase tracking-wider font-bold">NOVA-DASHBOARD</span>
        </div>
        <MoreHorizontal className="w-3 h-3 text-[#858585]" />
      </div>

      {/* Tree list */}
      <div className="flex-1 overflow-y-auto py-1 font-mono text-[12px] scrollbar-thin">
        {fileTree.map((node) => renderNode(node, 0))}
      </div>

      {/* Outline & Timeline sections */}
      <div className="border-t border-[#1e1e1e] flex flex-col text-[11px] font-semibold text-[#858585]">
        <div className="px-3 py-1.5 flex items-center justify-between hover:bg-[#2a2d2e] cursor-pointer">
          <div className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <span className="uppercase tracking-wider text-[10px]">Outline</span>
          </div>
        </div>
        <div className="px-3 py-1.5 flex items-center justify-between hover:bg-[#2a2d2e] cursor-pointer">
          <div className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <span className="uppercase tracking-wider text-[10px]">Timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
