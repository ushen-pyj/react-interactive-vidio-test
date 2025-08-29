// 互动视频框架类型定义

// 按钮动画配置
export interface ButtonAnimation {
  // 动画类型
  type: 'none' | 'pulse' | 'bounce' | 'glow' | 'ripple';
  // 动画持续时间（秒）
  duration?: number;
  // 动画延迟（秒）
  delay?: number;
  // 是否循环
  loop?: boolean;
}

// 背景动画配置
export interface BackgroundAnimation {
  // 动画类型
  type: 'horizontal' | 'vertical' | 'scale';
  // 动画速度（秒）
  duration?: number;
  // 动画幅度（像素或比例）
  amplitude?: number;
  // 是否启用
  enabled?: boolean;
}

// 按钮样式配置
export interface ButtonStyle {
  // 按钮形状
  shape: 'rectangle' | 'circle';
  // 按钮大小
  size: 'small' | 'medium' | 'large';
  // 文字位置（相对于按钮）
  textPosition: 'inside' | 'right' | 'left' | 'top' | 'bottom';
  // 自定义颜色
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  // 动画配置
  animation?: ButtonAnimation;
  // 是否透明底色
  transparent?: boolean;
}

// 按钮位置配置
export interface ButtonPosition {
  x: 'left' | 'center' | 'right';
  y: 'top' | 'center' | 'bottom';
  // 自定义偏移量（百分比）
  offsetX?: number;
  offsetY?: number;
}

// 标题配置
export interface TitleConfig {
  // 标题文字
  text: string;
  // 标题位置
  position?: {
    x: 'left' | 'center' | 'right';
    y: 'top' | 'center' | 'bottom';
    offsetX?: number;
    offsetY?: number;
  };
  // 标题样式
  style?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    backdropBlur?: boolean;
  };
}

// 分支选项接口
export interface BranchOption {
  id: string;
  label: string;
  text: string;
  description?: string;
  nextSegmentId: string;
  // 按钮位置配置
  position?: ButtonPosition;
  // 按钮样式配置
  style?: ButtonStyle;
}

// 视频片段接口
export interface VideoSegment {
  id: string;
  videoUrl: string;
  // 播放时长（秒）
  duration: number;
  // 快进到指定时间点（秒）
  seekTime?: number;
  // 分支触发点（相对于片段开始时间的秒数）
  branchTriggerTime?: number;
  // 分支选项
  branches?: BranchOption[];
  // 是否为结束片段
  isEnd?: boolean;
  // 分支选择时的标题配置
  branchTitle?: TitleConfig;
  // 背景动画配置
  backgroundAnimation?: BackgroundAnimation;
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
  duration: number;
  destination: any;
}

export interface VideoNode {
  start: (time: number) => void;
  stop: (time: number) => void;
  connect: (destination: any) => void;
  disconnect: () => void;
}