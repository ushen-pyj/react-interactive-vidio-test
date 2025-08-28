// 互动视频框架类型定义

// 按钮位置配置
export interface ButtonPosition {
  x: 'left' | 'center' | 'right';
  y: 'top' | 'center' | 'bottom';
  // 自定义偏移量（百分比）
  offsetX?: number;
  offsetY?: number;
}

// 分支选项接口
export interface BranchOption {
  id: string;
  label: string;
  description?: string;
  nextSegmentId: string;
  // 按钮位置配置
  position?: ButtonPosition;
}

// 视频片段接口
export interface VideoSegment {
  id: string;
  videoUrl: string;
  duration: number;
  startTime?: number;
  endTime?: number;
  // 分支触发点（相对于片段开始时间的秒数）
  branchTriggerTime?: number;
  // 分支选项
  branches?: BranchOption[];
  // 是否为结束片段
  isEnd?: boolean;
}

// 互动视频配置接口
export interface InteractiveVideoConfig {
  id: string;
  title: string;
  description?: string;
  // 起始片段ID
  startSegmentId: string;
  // 所有视频片段
  segments: VideoSegment[];
  // 全局设置
  settings?: {
    autoPlay?: boolean;
    showControls?: boolean;
    width?: number;
    height?: number;
  };
}

// 播放器状态
export enum PlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  WAITING_FOR_CHOICE = 'waiting_for_choice',
  ENDED = 'ended',
  ERROR = 'error'
}

// 播放器事件
export interface PlayerEvents {
  onStateChange: (state: PlayerState) => void;
  onSegmentStart: (segment: VideoSegment) => void;
  onSegmentEnd: (segment: VideoSegment) => void;
  onBranchTrigger: (segment: VideoSegment, branches: BranchOption[]) => void;
  onBranchSelect: (option: BranchOption) => void;
  onVideoEnd: () => void;
  onError: (error: Error) => void;
}

// VideoContext相关类型声明
declare global {
  interface Window {
    VideoContext: any;
  }
}

export interface VideoContextInstance {
  video: (src: string) => VideoNode;
  play: () => void;
  pause: () => void;
  currentTime: number;
  destination: any;
}

export interface VideoNode {
  start: (time: number) => void;
  stop: (time: number) => void;
  connect: (destination: any) => void;
}