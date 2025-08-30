'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoSegment, BranchOption } from '../types/interactive-video';

interface TreeVisualizationProps {
  segments: VideoSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  onAddSegment: (parentId?: string) => void;
  onDeleteSegment: (segmentId: string) => void;
  onUpdateSegmentPosition: (segmentId: string, x: number, y: number) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

interface TreeNode {
  segment: VideoSegment;
  position: NodePosition;
  children: string[];
}

export default function TreeVisualization({
  segments,
  selectedSegmentId,
  onSelectSegment,
  onAddSegment,
  onDeleteSegment,
  onUpdateSegmentPosition
}: TreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Map<string, TreeNode>>(new Map());
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1200, height: 800 });
  const [canvasBounds, setCanvasBounds] = useState({ minX: 0, minY: 0, maxX: 1200, maxY: 800 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // 计算画布边界
  const updateCanvasBounds = useCallback((nodes: Map<string, TreeNode>) => {
    if (nodes.size === 0) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      const { x, y } = node.position;
      minX = Math.min(minX, x - 50); // 添加边距
      minY = Math.min(minY, y - 50);
      maxX = Math.max(maxX, x + 250); // 节点宽度200 + 边距50
      maxY = Math.max(maxY, y + 150); // 节点高度100 + 边距50
    });
    
    // 确保最小画布大小
    const minWidth = 1200;
    const minHeight = 800;
    maxX = Math.max(maxX, minX + minWidth);
    maxY = Math.max(maxY, minY + minHeight);
    
    setCanvasBounds({ minX, minY, maxX, maxY });
  }, []);

  // 计算节点位置和连接关系
  const calculateLayout = useCallback(() => {
    const newNodes = new Map<string, TreeNode>();
    const visited = new Set<string>();
    
    // 找到根节点（没有被其他节点引用的节点）
    const referencedIds = new Set<string>();
    segments.forEach(segment => {
      segment.branches?.forEach(branch => {
        if (branch.nextSegmentId) {
          referencedIds.add(branch.nextSegmentId);
        }
      });
    });
    
    const rootNodes = segments.filter(segment => !referencedIds.has(segment.id));
    
    // 递归布局函数
    const layoutNode = (segment: VideoSegment, level: number, index: number, parentX?: number): NodePosition => {
      if (visited.has(segment.id)) {
        // 如果节点已经访问过，返回已有位置
        return nodes.get(segment.id)?.position || { x: 0, y: 0 };
      }
      
      visited.add(segment.id);
      
      // 计算节点位置
      const nodeWidth = 200;
      const nodeHeight = 100;
      const levelHeight = 150;
      const horizontalSpacing = 250;
      
      let x: number;
      let y = level * levelHeight + 50;
      
      if (level === 0) {
        // 根节点居中
        x = viewBox.width / 2 - nodeWidth / 2;
      } else if (parentX !== undefined) {
        // 子节点基于父节点位置
        const children = segment.branches || [];
        const totalWidth = children.length * horizontalSpacing;
        x = parentX - totalWidth / 2 + index * horizontalSpacing;
      } else {
        x = index * horizontalSpacing + 50;
      }
      
      const position = { x, y };
      
      // 获取子节点
      const childSegmentIds = segment.branches?.map(branch => branch.nextSegmentId).filter(Boolean) || [];
      const childSegments = childSegmentIds.map(id => segments.find(s => s.id === id)).filter(Boolean) as VideoSegment[];
      
      // 递归布局子节点
      childSegments.forEach((childSegment, childIndex) => {
        layoutNode(childSegment, level + 1, childIndex, x + nodeWidth / 2);
      });
      
      // 创建节点
      newNodes.set(segment.id, {
        segment,
        position,
        children: childSegmentIds
      });
      
      return position;
    };
    
    // 布局所有根节点
    rootNodes.forEach((rootSegment, index) => {
      layoutNode(rootSegment, 0, index);
    });
    
    // 处理孤立节点（没有连接关系的节点）
    segments.forEach((segment, index) => {
      if (!visited.has(segment.id)) {
        const x = (index % 4) * 250 + 50;
        const y = Math.floor(index / 4) * 150 + 400;
        newNodes.set(segment.id, {
          segment,
          position: { x, y },
          children: []
        });
      }
    });
    
    setNodes(newNodes);
    updateCanvasBounds(newNodes);
  }, [segments, viewBox.width, updateCanvasBounds]);

  // 当segments变化时重新计算布局
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  // 处理节点拖拽
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const node = nodes.get(nodeId);
    if (!node) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setDraggedNode(nodeId);
    setDragOffset({
      x: mouseX - node.position.x,
      y: mouseY - node.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;
      
      // 更新节点位置
      setNodes(prev => {
        const newNodes = new Map(prev);
        const node = newNodes.get(draggedNode);
        if (node) {
          node.position = { x: newX, y: newY };
          newNodes.set(draggedNode, node);
        }
        return newNodes;
      });
    } else if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      const node = nodes.get(draggedNode);
      if (node) {
        onUpdateSegmentPosition(draggedNode, node.position.x, node.position.y);
        // 拖拽结束后更新画布边界
        updateCanvasBounds(nodes);
      }
      setDraggedNode(null);
    }
    setIsPanning(false);
  };

  // 处理画布平移
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // 处理滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  // 重置视图
  const resetView = () => {
    setScale(1);
    setViewBox({ x: 0, y: 0, width: 1200, height: 800 });
  };

  // 绘制连接线
  const renderConnections = () => {
    const connections: React.ReactElement[] = [];
    
    nodes.forEach((node, nodeId) => {
      node.children.forEach(childId => {
        const childNode = nodes.get(childId);
        if (!childNode) return;
        
        const startX = node.position.x + 100; // 节点中心
        const startY = node.position.y + 50;
        const endX = childNode.position.x + 100;
        const endY = childNode.position.y + 50;
        
        // 计算贝塞尔曲线控制点
        const controlY = startY + (endY - startY) / 2;
        
        connections.push(
          <path
            key={`${nodeId}-${childId}`}
            d={`M ${startX} ${startY} C ${startX} ${controlY} ${endX} ${controlY} ${endX} ${endY}`}
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      });
    });
    
    return connections;
  };

  // 渲染节点
  const renderNodes = () => {
    return Array.from(nodes.entries()).map(([nodeId, node]) => {
      const isSelected = selectedSegmentId === nodeId;
      const isEnd = node.segment.isEnd;
      
      return (
        <g key={nodeId} transform={`translate(${node.position.x}, ${node.position.y})`}>
          {/* 节点背景 */}
          <rect
            width="200"
            height="100"
            rx="8"
            fill={isSelected ? '#EBF8FF' : isEnd ? '#FEF2F2' : '#F9FAFB'}
            stroke={isSelected ? '#3B82F6' : isEnd ? '#EF4444' : '#E5E7EB'}
            strokeWidth={isSelected ? '3' : '2'}
            className="cursor-pointer hover:shadow-lg transition-all"
            onMouseDown={(e) => handleMouseDown(e, nodeId)}
            onClick={() => onSelectSegment(nodeId)}
          />
          
          {/* 节点内容 */}
          <text
            x="100"
            y="25"
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-800 pointer-events-none"
          >
            {node.segment.id}
          </text>
          
          <text
            x="100"
            y="45"
            textAnchor="middle"
            className="text-xs fill-gray-600 pointer-events-none"
          >
            时长: {node.segment.duration}s
          </text>
          
          <text
            x="100"
            y="60"
            textAnchor="middle"
            className="text-xs fill-gray-600 pointer-events-none"
          >
            分支: {node.segment.branches?.length || 0}
          </text>
          
          {isEnd && (
            <text
              x="100"
              y="80"
              textAnchor="middle"
              className="text-xs font-medium fill-red-600 pointer-events-none"
            >
              结束节点
            </text>
          )}
          
          {/* 添加子节点按钮 */}
          <circle
            cx="190"
            cy="50"
            r="12"
            fill="#10B981"
            className="cursor-pointer hover:fill-green-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onAddSegment(nodeId);
            }}
          />
          <text
            x="190"
            y="55"
            textAnchor="middle"
            className="text-white text-sm font-bold pointer-events-none"
          >
            +
          </text>
          
          {/* 删除节点按钮 */}
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="#EF4444"
            className="cursor-pointer hover:fill-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSegment(nodeId);
            }}
          />
          <text
            x="10"
            y="14"
            textAnchor="middle"
            className="text-white text-xs font-bold pointer-events-none"
          >
            ×
          </text>
        </g>
      );
    });
  };

  return (
    <div className="w-full h-full bg-gray-50 relative overflow-auto" ref={containerRef}>
      {/* 工具栏 */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => onAddSegment()}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          + 添加根节点
        </button>
        <button
          onClick={calculateLayout}
          className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
          重新布局
        </button>
        <button
          onClick={resetView}
          className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
        >
          重置视图
        </button>
      </div>
      
      {/* 说明文字 */}
      <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded-lg shadow-sm text-xs text-gray-600">
        <div>• 拖拽节点移动位置</div>
        <div>• 点击节点选择编辑</div>
        <div>• 绿色 + 添加子节点</div>
        <div>• 红色 × 删除节点</div>
        <div>• 滚轮缩放画布</div>
        <div>• 画布可无限扩展</div>
      </div>

      {/* SVG画布 */}
      <svg
        ref={svgRef}
        width={Math.max(canvasBounds.maxX - canvasBounds.minX, viewBox.width) * scale}
        height={Math.max(canvasBounds.maxY - canvasBounds.minY, viewBox.height) * scale}
        viewBox={`${canvasBounds.minX} ${canvasBounds.minY} ${canvasBounds.maxX - canvasBounds.minX} ${canvasBounds.maxY - canvasBounds.minY}`}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handlePanStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* 箭头标记定义 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6B7280"
            />
          </marker>
        </defs>
        
        {/* 网格背景 */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E7EB" strokeWidth="1" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* 连接线 */}
        {renderConnections()}
        
        {/* 节点 */}
        {renderNodes()}
      </svg>
    </div>
  );
}