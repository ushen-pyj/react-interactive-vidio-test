'use client';

import React, { useMemo } from 'react';
import { InteractiveVideoConfig, VideoSegment } from '../types/interactive-video';

interface TreeNode {
  name: string;
  id: string;
  label?: string;
  isEnd?: boolean;
  children?: TreeNode[];
}

interface BranchTreeProps {
  config: InteractiveVideoConfig;
  className?: string;
}

// 简单的树状图组件，使用纯CSS和SVG实现
const BranchTree: React.FC<BranchTreeProps> = ({ config, className = '' }) => {
  const treeData = useMemo(() => {
    const segmentMap = new Map<string, VideoSegment>();
    config.segments.forEach(segment => {
      segmentMap.set(segment.id, segment);
    });

    const buildTree = (segmentId: string, branchLabel?: string, visited = new Set<string>()): TreeNode => {
      if (visited.has(segmentId)) {
        return { name: `${segmentId} (循环)`, id: segmentId, label: branchLabel };
      }
      
      visited.add(segmentId);
      const segment = segmentMap.get(segmentId);
      
      if (!segment) {
        return { name: segmentId, id: segmentId, label: branchLabel };
      }

      const node: TreeNode = {
        name: segment.id,
        id: segment.id,
        label: branchLabel,
        isEnd: segment.isEnd
      };

      if (segment.branches && segment.branches.length > 0) {
        node.children = segment.branches.map(branch => 
          buildTree(branch.nextSegmentId, branch.label, new Set(visited))
        );
      }

      return node;
    };

    return buildTree(config.startSegmentId);
  }, [config]);

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="flex items-start">
        <div className="flex flex-col items-center">
          {/* 节点 */}
          <div 
            className={`
              px-3 py-2 rounded-lg border-2 text-sm font-medium min-w-[120px] text-center
              ${node.isEnd 
                ? 'bg-red-100 border-red-300 text-red-800' 
                : 'bg-blue-100 border-blue-300 text-blue-800'
              }
              ${level === 0 ? 'bg-green-100 border-green-300 text-green-800' : ''}
            `}
          >
            <div className="font-semibold">{node.name}</div>
            {node.label && <div className="text-xs mt-1 opacity-80">{node.label}</div>}
            {node.isEnd && <div className="text-xs text-red-600 mt-1">结束</div>}
          </div>
          
          {/* 连接线 */}
          {hasChildren && (
            <div className="w-px h-4 bg-gray-300 mt-2"></div>
          )}
        </div>
        
        {/* 子节点 */}
        {hasChildren && (
          <div className="ml-6 mt-8">
            <div className="flex flex-col space-y-4">
              {node.children!.map((child, index) => (
                <div key={child.id} className="relative">
                  {/* 水平连接线 */}
                  <div className="absolute -left-6 top-4 w-6 h-px bg-gray-300"></div>
                  {/* 垂直连接线 */}
                  {index > 0 && (
                    <div className="absolute -left-6 top-0 w-px bg-gray-300" 
                         style={{ height: '16px' }}></div>
                  )}
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">分支结构图</h3>
      <div className="overflow-x-auto">
        <div className="min-w-max p-4">
          {renderNode(treeData)}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span>起始节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
            <span>分支节点</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
            <span>结束节点</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchTree;