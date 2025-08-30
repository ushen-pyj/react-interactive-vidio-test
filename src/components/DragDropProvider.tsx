'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VideoSegment } from '../types/interactive-video';

interface DragDropContextType {
  draggedItem: DraggedItem | null;
  dragPreview: DragPreview | null;
  startDrag: (item: DraggedItem, preview: DragPreview) => void;
  endDrag: () => void;
  updateDragPreview: (preview: DragPreview) => void;
  isValidDropTarget: (targetId: string, targetType: string) => boolean;
}

interface DraggedItem {
  id: string;
  type: 'segment' | 'branch';
  data: any;
  sourceId?: string;
}

interface DragPreview {
  x: number;
  y: number;
  width: number;
  height: number;
  content: ReactNode;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
  segments: VideoSegment[];
  onCreateConnection: (sourceId: string, targetId: string) => void;
  onMoveSegment: (segmentId: string, newPosition: { x: number; y: number }) => void;
}

export default function DragDropProvider({
  children,
  segments,
  onCreateConnection,
  onMoveSegment
}: DragDropProviderProps) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);

  const startDrag = useCallback((item: DraggedItem, preview: DragPreview) => {
    setDraggedItem(item);
    setDragPreview(preview);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
    setDragPreview(null);
  }, []);

  const updateDragPreview = useCallback((preview: DragPreview) => {
    setDragPreview(preview);
  }, []);

  const isValidDropTarget = useCallback((targetId: string, targetType: string) => {
    if (!draggedItem) return false;
    
    // 不能拖拽到自己
    if (draggedItem.id === targetId) return false;
    
    // 根据拖拽类型和目标类型判断是否可以放置
    if (draggedItem.type === 'segment') {
      // 片段可以连接到其他片段
      return targetType === 'segment';
    }
    
    if (draggedItem.type === 'branch') {
      // 分支可以连接到片段
      return targetType === 'segment';
    }
    
    return false;
  }, [draggedItem]);

  const contextValue: DragDropContextType = {
    draggedItem,
    dragPreview,
    startDrag,
    endDrag,
    updateDragPreview,
    isValidDropTarget
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      <div className="relative w-full h-full">
        {children}
        
        {/* 拖拽预览 */}
        {dragPreview && (
          <div
            className="fixed pointer-events-none z-50 opacity-80"
            style={{
              left: dragPreview.x,
              top: dragPreview.y,
              width: dragPreview.width,
              height: dragPreview.height,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {dragPreview.content}
          </div>
        )}
      </div>
    </DragDropContext.Provider>
  );
}

// 可拖拽组件
interface DraggableProps {
  id: string;
  type: 'segment' | 'branch';
  data: any;
  children: ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
}

export function Draggable({
  id,
  type,
  data,
  children,
  onDragStart,
  onDragEnd,
  className = ''
}: DraggableProps) {
  const { startDrag, endDrag, updateDragPreview } = useDragDrop();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onDragStart?.();

    const rect = e.currentTarget.getBoundingClientRect();
    const preview: DragPreview = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      content: (
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 shadow-lg">
          {children}
        </div>
      )
    };

    startDrag({ id, type, data }, preview);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateDragPreview({
        ...preview,
        x: moveEvent.clientX,
        y: moveEvent.clientY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      endDrag();
      onDragEnd?.();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`${className} ${isDragging ? 'opacity-50' : ''} cursor-grab active:cursor-grabbing`}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

// 可放置组件
interface DroppableProps {
  id: string;
  type: string;
  onDrop: (draggedItem: DraggedItem) => void;
  children: ReactNode;
  className?: string;
}

export function Droppable({
  id,
  type,
  onDrop,
  children,
  className = ''
}: DroppableProps) {
  const { draggedItem, isValidDropTarget } = useDragDrop();
  const [isHovered, setIsHovered] = useState(false);
  
  const canDrop = draggedItem && isValidDropTarget(id, type);

  const handleMouseEnter = () => {
    if (canDrop) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    if (canDrop && draggedItem) {
      onDrop(draggedItem);
    }
    setIsHovered(false);
  };

  return (
    <div
      className={`${className} ${canDrop && isHovered ? 'ring-2 ring-blue-400 bg-blue-50' : ''} transition-all`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {children}
      {canDrop && isHovered && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}

// 连接线组件
interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function ConnectionLine({
  startX,
  startY,
  endX,
  endY,
  isActive = false,
  onClick
}: ConnectionLineProps) {
  // 计算贝塞尔曲线控制点
  const controlY = startY + (endY - startY) / 2;
  
  return (
    <g>
      <path
        d={`M ${startX} ${startY} C ${startX} ${controlY} ${endX} ${controlY} ${endX} ${endY}`}
        stroke={isActive ? '#3B82F6' : '#6B7280'}
        strokeWidth={isActive ? '3' : '2'}
        fill="none"
        markerEnd="url(#arrowhead)"
        className="cursor-pointer hover:stroke-blue-500 transition-colors"
        onClick={onClick}
      />
      {/* 不可见的粗线，用于更容易的点击 */}
      <path
        d={`M ${startX} ${startY} C ${startX} ${controlY} ${endX} ${controlY} ${endX} ${endY}`}
        stroke="transparent"
        strokeWidth="10"
        fill="none"
        className="cursor-pointer"
        onClick={onClick}
      />
    </g>
  );
}