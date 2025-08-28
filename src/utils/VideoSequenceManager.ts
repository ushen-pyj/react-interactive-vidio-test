import {
  InteractiveVideoConfig,
  VideoSegment,
  BranchOption,
  PlayerState,
  VideoContextInstance,
  VideoNode
} from '../types/interactive-video';

// 播放历史记录
interface PlaybackHistory {
  segmentId: string;
  timestamp: number;
  branchChoice?: BranchOption;
}

// 序列管理器配置
interface SequenceManagerConfig {
  autoSave?: boolean; // 自动保存进度
  enableHistory?: boolean; // 启用历史记录
  preloadNext?: boolean; // 预加载下一个片段
}

export class VideoSequenceManager {
  private config: InteractiveVideoConfig;
  private videoContext: VideoContextInstance | null = null;
  private currentSegment: VideoSegment | null = null;
  private playbackHistory: PlaybackHistory[] = [];
  private preloadedNodes: Map<string, VideoNode> = new Map();
  private sequenceConfig: SequenceManagerConfig;
  
  // 事件回调
  private onStateChange?: (state: PlayerState) => void;
  private onSegmentChange?: (segment: VideoSegment) => void;
  private onBranchTrigger?: (segment: VideoSegment, branches: BranchOption[]) => void;
  private onError?: (error: Error) => void;

  constructor(
    config: InteractiveVideoConfig,
    sequenceConfig: SequenceManagerConfig = {}
  ) {
    this.config = config;
    this.sequenceConfig = {
      autoSave: true,
      enableHistory: true,
      preloadNext: false,
      ...sequenceConfig
    };
  }

  // 设置VideoContext实例
  setVideoContext(videoContext: VideoContextInstance) {
    this.videoContext = videoContext;
  }

  // 设置事件回调
  setEventHandlers(handlers: {
    onStateChange?: (state: PlayerState) => void;
    onSegmentChange?: (segment: VideoSegment) => void;
    onBranchTrigger?: (segment: VideoSegment, branches: BranchOption[]) => void;
    onError?: (error: Error) => void;
  }) {
    this.onStateChange = handlers.onStateChange;
    this.onSegmentChange = handlers.onSegmentChange;
    this.onBranchTrigger = handlers.onBranchTrigger;
    this.onError = handlers.onError;
  }

  // 开始播放序列
  async startSequence(): Promise<void> {
    try {
      const startSegment = this.getSegmentById(this.config.startSegmentId);
      if (!startSegment) {
        throw new Error(`Start segment not found: ${this.config.startSegmentId}`);
      }

      await this.playSegment(startSegment);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 播放指定片段
  async playSegment(segment: VideoSegment): Promise<void> {
    if (!this.videoContext) {
      throw new Error('VideoContext not initialized');
    }

    try {
      this.onStateChange?.(PlayerState.LOADING);
      
      // 记录播放历史
      if (this.sequenceConfig.enableHistory) {
        this.addToHistory(segment.id);
      }

      // 设置当前片段
      this.currentSegment = segment;
      this.onSegmentChange?.(segment);

      // 创建或获取预加载的视频节点
      let videoNode = this.preloadedNodes.get(segment.id);
      if (!videoNode) {
        videoNode = this.videoContext.video(segment.videoUrl);
      }

      // 连接到输出
      videoNode.connect(this.videoContext.destination);

      // 设置播放时间
      const startTime = segment.startTime || 0;
      const endTime = segment.endTime || segment.duration;
      
      videoNode.start(startTime);
      videoNode.stop(endTime);

      // 开始播放
      this.videoContext.play();
      this.onStateChange?.(PlayerState.PLAYING);

      // 预加载下一个可能的片段
      if (this.sequenceConfig.preloadNext) {
        this.preloadNextSegments(segment);
      }

      // 设置分支触发点
      if (segment.branchTriggerTime && segment.branches) {
        setTimeout(() => {
          this.triggerBranchSelection(segment);
        }, segment.branchTriggerTime * 1000);
      }

      // 设置片段结束处理
      setTimeout(() => {
        this.handleSegmentEnd(segment);
      }, (endTime - startTime) * 1000);

    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 触发分支选择
  private triggerBranchSelection(segment: VideoSegment): void {
    if (!segment.branches || segment.branches.length === 0) {
      return;
    }

    // 暂停视频
    this.videoContext?.pause();
    this.onStateChange?.(PlayerState.WAITING_FOR_CHOICE);
    this.onBranchTrigger?.(segment, segment.branches);
  }

  // 选择分支
  async selectBranch(option: BranchOption): Promise<void> {
    try {
      // 记录分支选择
      if (this.sequenceConfig.enableHistory && this.currentSegment) {
        this.updateHistoryWithBranch(this.currentSegment.id, option);
      }

      // 播放下一个片段
      const nextSegment = this.getSegmentById(option.nextSegmentId);
      if (!nextSegment) {
        throw new Error(`Next segment not found: ${option.nextSegmentId}`);
      }

      await this.playSegment(nextSegment);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 处理片段结束
  private handleSegmentEnd(segment: VideoSegment): void {
    if (segment.isEnd) {
      this.onStateChange?.(PlayerState.ENDED);
      this.saveProgress();
    } else if (!segment.branches || segment.branches.length === 0) {
      // 如果没有分支，寻找默认的下一个片段
      const nextSegment = this.findNextSegment(segment);
      if (nextSegment) {
        this.playSegment(nextSegment);
      } else {
        this.onStateChange?.(PlayerState.ENDED);
        this.saveProgress();
      }
    }
  }

  // 预加载下一个可能的片段
  private preloadNextSegments(segment: VideoSegment): void {
    if (!this.videoContext) return;

    const nextSegments: string[] = [];
    
    // 收集所有可能的下一个片段ID
    if (segment.branches) {
      nextSegments.push(...segment.branches.map(b => b.nextSegmentId));
    } else {
      const defaultNext = this.findNextSegment(segment);
      if (defaultNext) {
        nextSegments.push(defaultNext.id);
      }
    }

    // 预加载这些片段
    nextSegments.forEach(segmentId => {
      if (!this.preloadedNodes.has(segmentId)) {
        const nextSegment = this.getSegmentById(segmentId);
        if (nextSegment) {
          try {
            const videoNode = this.videoContext!.video(nextSegment.videoUrl);
            this.preloadedNodes.set(segmentId, videoNode);
          } catch (error) {
            console.warn(`Failed to preload segment ${segmentId}:`, error);
          }
        }
      }
    });
  }

  // 查找下一个片段（用于没有分支的情况）
  private findNextSegment(currentSegment: VideoSegment): VideoSegment | null {
    // 这里可以实现更复杂的逻辑，比如按顺序播放
    const currentIndex = this.config.segments.findIndex(s => s.id === currentSegment.id);
    if (currentIndex >= 0 && currentIndex < this.config.segments.length - 1) {
      return this.config.segments[currentIndex + 1];
    }
    return null;
  }

  // 根据ID获取片段
  private getSegmentById(id: string): VideoSegment | null {
    return this.config.segments.find(s => s.id === id) || null;
  }

  // 添加到播放历史
  private addToHistory(segmentId: string): void {
    this.playbackHistory.push({
      segmentId,
      timestamp: Date.now()
    });
  }

  // 更新历史记录中的分支选择
  private updateHistoryWithBranch(segmentId: string, branch: BranchOption): void {
    const lastEntry = this.playbackHistory[this.playbackHistory.length - 1];
    if (lastEntry && lastEntry.segmentId === segmentId) {
      lastEntry.branchChoice = branch;
    }
  }

  // 保存进度
  private saveProgress(): void {
    if (!this.sequenceConfig.autoSave) return;

    try {
      const progress = {
        configId: this.config.id,
        currentSegmentId: this.currentSegment?.id,
        history: this.playbackHistory,
        timestamp: Date.now()
      };

      localStorage.setItem(`interactive-video-progress-${this.config.id}`, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }

  // 加载进度
  loadProgress(): boolean {
    try {
      const saved = localStorage.getItem(`interactive-video-progress-${this.config.id}`);
      if (!saved) return false;

      const progress = JSON.parse(saved);
      this.playbackHistory = progress.history || [];
      
      // 可以选择从保存的位置继续播放
      if (progress.currentSegmentId) {
        const segment = this.getSegmentById(progress.currentSegmentId);
        if (segment) {
          this.playSegment(segment);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
    }
    return false;
  }

  // 清除进度
  clearProgress(): void {
    localStorage.removeItem(`interactive-video-progress-${this.config.id}`);
    this.playbackHistory = [];
  }

  // 获取播放历史
  getPlaybackHistory(): PlaybackHistory[] {
    return [...this.playbackHistory];
  }

  // 获取当前片段
  getCurrentSegment(): VideoSegment | null {
    return this.currentSegment;
  }

  // 错误处理
  private handleError(error: Error): void {
    console.error('VideoSequenceManager error:', error);
    this.onError?.(error);
    this.onStateChange?.(PlayerState.ERROR);
  }

  // 清理资源
  dispose(): void {
    // 清理预加载的节点
    this.preloadedNodes.clear();
    
    // 保存最终进度
    this.saveProgress();
    
    // 重置状态
    this.currentSegment = null;
    this.videoContext = null;
  }
}

export default VideoSequenceManager;