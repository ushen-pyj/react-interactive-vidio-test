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
  
  // 播放状态管理
  private isPlaying: boolean = false;
  private isTransitioning: boolean = false;
  private currentPlayPromise: Promise<void> | null = null;
  private pendingTimeouts: Set<NodeJS.Timeout> = new Set();
  
  // 事件回调
  private onStateChange?: (state: PlayerState) => void;
  private onSegmentChange?: (segment: VideoSegment) => void;
  private onBranchTrigger?: (segment: VideoSegment, branches: BranchOption[]) => void;
  private onError?: (error: Error) => void;
  private onFrameCapture?: (frameData: string, segment: VideoSegment) => void;

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
    onFrameCapture?: (frameData: string, segment: VideoSegment) => void;
  }) {
    this.onStateChange = handlers.onStateChange;
    this.onSegmentChange = handlers.onSegmentChange;
    this.onBranchTrigger = handlers.onBranchTrigger;
    this.onError = handlers.onError;
    this.onFrameCapture = handlers.onFrameCapture;
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

  // 通过ID播放片段
  async playSegmentById(segmentId: string): Promise<void> {
    const segment = this.getSegmentById(segmentId);
    if (!segment) {
      throw new Error(`Segment not found: ${segmentId}`);
    }
    await this.playSegment(segment);
  }

  // 播放指定片段
  async playSegment(segment: VideoSegment): Promise<void> {
    if (!this.videoContext) {
      throw new Error('VideoContext not initialized');
    }

    // 防止并发播放请求
    if (this.isTransitioning) {
      console.warn('Segment transition already in progress, ignoring request');
      return;
    }

    // 如果有正在进行的播放请求，等待其完成
    if (this.currentPlayPromise) {
      try {
        await this.currentPlayPromise;
      } catch (error) {
        console.warn('Previous play promise failed:', error);
      }
    }

    this.isTransitioning = true;
    this.clearPendingTimeouts();

    try {
      this.onStateChange?.(PlayerState.LOADING);
      
      // 先停止当前播放，避免播放请求冲突
      try {
        await this.videoContext.pause();
        this.isPlaying = false;
        // 给一个短暂的延迟确保停止完成
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (pauseError) {
        console.warn('Error pausing previous playback in VideoSequenceManager:', pauseError);
      }
      
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

      // 设置播放时间 - 使用新的seekTime和duration配置
      const seekTime = segment.seekTime || 0;
      const endTime = seekTime + segment.duration;
      
      videoNode.start(seekTime);
      videoNode.stop(endTime);

      // 等待视频元数据加载完成，然后打印实际时长
      const checkVideoDuration = () => {
        // 尝试从VideoContext获取duration
        if (this.videoContext && this.videoContext.duration) {
          const actualDuration = this.videoContext.duration;
          console.log(this.videoContext)
          console.log(`🎬 视频实际时长: ${actualDuration.toFixed(2)}秒 (${(actualDuration/60).toFixed(2)}分钟)`);
          console.log(`📊 配置中的duration: ${segment.duration}秒 ${seekTime} ${endTime}`);
          console.log(`⚠️  时长差异: ${Math.abs(actualDuration - segment.duration).toFixed(2)}秒`);
        } else {
          // 如果还没加载完成，延迟重试
          setTimeout(checkVideoDuration, 100);
        }
      };
      
      // 延迟检查，确保视频元数据已加载
      setTimeout(checkVideoDuration, 500);

      // 开始播放 - 使用更健壮的错误处理
      this.currentPlayPromise = this.attemptPlay();
      await this.currentPlayPromise;
      
      this.isPlaying = true;
      this.isTransitioning = false;
      this.onStateChange?.(PlayerState.PLAYING);

      // 预加载下一个可能的片段
      if (this.sequenceConfig.preloadNext) {
        this.preloadNextSegments(segment);
      }

      // 设置分支触发点
      if (segment.branchTriggerTime && segment.branches) {
        console.log('⏰ 设置分支触发定时器，片段:', segment.id, '触发时间:', segment.branchTriggerTime, '秒');
        const branchTimeout = setTimeout(async () => {
          console.log('⏰ 分支触发定时器执行，片段:', segment.id);
          if (this.currentSegment?.id === segment.id) {
            console.log('✅ 当前片段匹配，触发分支选择');
            await this.triggerBranchSelection(segment);
          } else {
            console.log('❌ 当前片段不匹配，跳过触发。当前:', this.currentSegment?.id, '期望:', segment.id);
          }
        }, segment.branchTriggerTime * 1000);
        this.pendingTimeouts.add(branchTimeout);
        console.log('✅ 分支触发定时器已设置，延迟:', segment.branchTriggerTime * 1000, 'ms');
      } else {
        console.log('❌ 未设置分支触发定时器 - branchTriggerTime:', segment.branchTriggerTime, 'branches:', segment.branches?.length || 0);
      }

      // 设置片段结束处理
      const endTimeout = setTimeout(() => {
        if (this.currentSegment?.id === segment.id) {
          this.handleSegmentEnd(segment);
        }
      }, segment.duration * 1000);
      this.pendingTimeouts.add(endTimeout);

    } catch (error) {
      this.isTransitioning = false;
      this.currentPlayPromise = null;
      this.handleError(error as Error);
    } finally {
      this.currentPlayPromise = null;
    }
  }

  // 尝试播放视频的辅助方法
  private async attemptPlay(): Promise<void> {
    if (!this.videoContext) {
      throw new Error('VideoContext not initialized');
    }

    let playAttempts = 0;
    const maxPlayAttempts = 3;
    
    while (playAttempts < maxPlayAttempts) {
      try {
        await this.videoContext.play();
        return; // 播放成功，退出
      } catch (playError: any) {
        playAttempts++;
        
        if (playError.name === 'AbortError') {
          console.warn(`Play request was interrupted (attempt ${playAttempts}/${maxPlayAttempts})`);
          
          if (playAttempts < maxPlayAttempts) {
            // 递增延迟重试
            await new Promise(resolve => setTimeout(resolve, 50 * playAttempts));
            continue;
          } else {
            console.error('Max play attempts reached, giving up');
            throw new Error('Failed to start playback after multiple attempts');
          }
        } else {
          // 非AbortError，直接抛出
          throw playError;
        }
      }
    }
  }

  // 清理待处理的定时器
  private clearPendingTimeouts(): void {
    this.pendingTimeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    this.pendingTimeouts.clear();
  }

  // 获取当前视频帧
  private captureCurrentFrame(): string | null {
    if (!this.videoContext) return null;
    
    try {
      // 从VideoContext的canvas获取当前帧
      const canvas = document.querySelector('canvas');
      if (canvas && canvas instanceof HTMLCanvasElement) {
        console.log('📸 正在捕获视频帧...');
        const frameData = canvas.toDataURL('image/jpeg', 0.8);
        console.log('✅ 视频帧捕获成功，数据长度:', frameData.length);
        return frameData;
      } else {
        console.warn('❌ 未找到canvas元素或canvas类型不正确');
      }
    } catch (error) {
      console.warn('❌ 捕获视频帧失败:', error);
    }
    return null;
  }

  // 触发分支选择
  private async triggerBranchSelection(segment: VideoSegment): Promise<void> {
    console.log('🎯 触发分支选择，片段:', segment.id);
    
    if (!segment.branches || segment.branches.length === 0) {
      console.log('❌ 没有分支选项，跳过');
      return;
    }

    console.log('🎬 分支数量:', segment.branches.length);
    console.log('🎨 背景动画配置:', segment.backgroundAnimation);

    // 获取当前帧图片
    const frameData = this.captureCurrentFrame();
    if (frameData) {
      console.log('✅ 帧数据获取成功，触发 onFrameCapture 回调');
      this.onFrameCapture?.(frameData, segment);
    } else {
      console.warn('❌ 帧数据获取失败');
    }

    // 暂停视频 - 使用 async/await 确保暂停完成
    try {
      if (this.videoContext && this.isPlaying) {
        console.log('⏸️ 暂停视频播放');
        await this.videoContext.pause();
        this.isPlaying = false;
      }
      this.onStateChange?.(PlayerState.WAITING_FOR_CHOICE);
      this.onBranchTrigger?.(segment, segment.branches);
      console.log('✅ 分支选择界面已显示');
    } catch (error) {
      console.warn('❌ 暂停视频时出错:', error);
      // 即使暂停失败，也要显示分支选择
      this.isPlaying = false;
      this.onStateChange?.(PlayerState.WAITING_FOR_CHOICE);
      this.onBranchTrigger?.(segment, segment.branches);
    }
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

  // 播放控制方法
  async play(): Promise<void> {
    if (!this.videoContext) {
      throw new Error('VideoContext not initialized');
    }

    if (this.isPlaying || this.isTransitioning) {
      console.warn('Video is already playing or transitioning');
      return;
    }

    try {
      await this.attemptPlay();
      this.isPlaying = true;
      this.onStateChange?.(PlayerState.PLAYING);
    } catch (error: any) {
      console.error('Error playing video:', error);
      this.handleError(error);
    }
  }

  async pause(): Promise<void> {
    if (!this.videoContext) {
      throw new Error('VideoContext not initialized');
    }

    if (!this.isPlaying) {
      console.warn('Video is not currently playing');
      return;
    }

    try {
      await this.videoContext.pause();
      this.isPlaying = false;
      this.onStateChange?.(PlayerState.PAUSED);
    } catch (error: any) {
      console.warn('Error pausing video:', error);
      // 即使暂停失败，也要更新状态
      this.isPlaying = false;
      this.onStateChange?.(PlayerState.PAUSED);
    }
  }

  // 错误处理
  private handleError(error: Error): void {
    console.error('VideoSequenceManager error:', error);
    this.onError?.(error);
    this.onStateChange?.(PlayerState.ERROR);
  }

  // 清理资源
  dispose(): void {
    // 清理所有待处理的定时器
    this.clearPendingTimeouts();
    
    // 清理预加载的节点
    this.preloadedNodes.clear();
    
    // 保存最终进度
    this.saveProgress();
    
    // 重置状态
    this.currentSegment = null;
    this.videoContext = null;
    this.isPlaying = false;
    this.isTransitioning = false;
    this.currentPlayPromise = null;
  }
}

export default VideoSequenceManager;