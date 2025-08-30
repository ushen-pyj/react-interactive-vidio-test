import {
  VideoSegment,
  BranchOption,
  PlayerState,
  VideoContextInstance,
  VideoNode,
  EVENTS
} from '../types/interactive-video';

// 视频片段播放器事件接口
export interface VideoSegmentPlayerEvents {
  onStateChange?: (state: PlayerState, segment: VideoSegment) => void;
  onBranchTrigger?: (segment: VideoSegment, branches: BranchOption[]) => void;
  onSegmentEnd?: (segment: VideoSegment) => void;
  onError?: (error: Error, segment: VideoSegment) => void;
  onFrameCapture?: (frameData: string, segment: VideoSegment) => void;
}

// 视频片段播放器类 - 负责单个片段的播放和生命周期管理
export class VideoSegmentPlayer {
  private segment: VideoSegment;
  private videoContext: VideoContextInstance;
  private videoNode: VideoNode | null = null;
  private events: VideoSegmentPlayerEvents;
  
  // 独立的播放状态
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  private currentPlayPromise: Promise<void> | null = null;
  private branchTimeout: NodeJS.Timeout | null = null;
  private endTimeout: NodeJS.Timeout | null = null;
  private startTime: number = 0;

  constructor(
    segment: VideoSegment,
    videoContext: VideoContextInstance,
    startTime: number,
    events: VideoSegmentPlayerEvents = {}
  ) {
    this.segment = segment;
    this.videoContext = videoContext;
    this.events = events;
    this.startTime = startTime;
  }

  // 获取片段信息
  getSegment(): VideoSegment {
    return this.segment;
  }

  // 获取播放状态
  getPlayingState(): boolean {
    return this.isPlaying;
  }

  // 获取加载状态
  getLoadingState(): boolean {
    return this.isLoading;
  }

  // 播放片段
  async play(): Promise<void> {
    if (this.isPlaying || this.isLoading) {
      console.warn(`Segment ${this.segment.id} is already playing or loading`);
      return;
    }

    // 如果有正在进行的播放请求，等待其完成
    if (this.currentPlayPromise) {
      try {
        await this.currentPlayPromise;
      } catch (error) {
        console.warn(`Previous play promise failed for segment ${this.segment.id}:`, error);
      }
    }

    this.isLoading = true;
    this.clearTimeouts();

    try {
      this.events.onStateChange?.(PlayerState.LOADING, this.segment);
      
      // 确保videoContext处于正确状态
      try {
        await this.videoContext.pause();
      } catch (error) {
        // 忽略pause错误，可能videoContext还没有开始播放
      }
      
      // 创建新的视频节点
      console.log(`🔄 创建视频节点，片段: ${this.segment.id}, URL: ${this.segment.videoUrl}`);
      this.videoNode = this.videoContext.video(this.segment.videoUrl);
      
      // 验证视频节点创建成功
      if (!this.videoNode) {
        throw new Error(`Failed to create video node for segment ${this.segment.id}`);
      }
      

      const endTime = this.startTime + this.segment.duration;
      
      console.log(this.videoContext.currentTime, `⏰ \n 设置播放时间: ${this.startTime}s - ${endTime}s (时长: ${this.segment.duration}s)`);
      
      // 设置视频节点在VideoContext时间轴上的播放时间
      this.videoNode.start(this.startTime);
      this.videoNode.stop(endTime);
      // 连接到输出
      this.videoNode.connect(this.videoContext.destination);
      
      // 重要：设置VideoContext的当前时间到片段开始时间
      this.videoContext.currentTime = this.videoNode.startTime;

      // 开始播放
      this.currentPlayPromise = this.attemptPlay();
      await this.currentPlayPromise;
      
      this.isPlaying = true;
      this.isLoading = false;
      this.events.onStateChange?.(PlayerState.PLAYING, this.segment);
      let branchTime = this.videoNode.startTime + (this.segment.branchTriggerTime ?? this.segment.duration);
      // // 设置分支触发定时器（片段结束事件将在分支选择触发时处理）
      // this.setupBranchTrigger();
      let handleUpdate: () => void;
      handleUpdate = () => {
        // console.log("handleUpdate", this.videoContext.currentTime, branchTime);
        if (this.videoContext.currentTime < branchTime) {
          return
        }
        this.videoContext.unregisterCallback(handleUpdate);
        if (this.segment.branchTriggerTime && this.segment.branches) {
          this.triggerBranchSelection();
        }else{
          this.handleSegmentEnd();
        }
      };
      this.videoContext.registerCallback(EVENTS.UPDATE, handleUpdate);
      console.log(`✅ 片段 ${this.segment.id} 开始播放`);

    } catch (error) {
      this.isLoading = false;
      this.currentPlayPromise = null;
      this.handleError(error as Error);
    } finally {
      this.currentPlayPromise = null;
    }
  }

  // 暂停播放
  async pause(): Promise<void> {
    if (!this.isPlaying) {
      console.warn(`Segment ${this.segment.id} is not currently playing`);
      return;
    }

    try {
      await this.videoContext.pause();
      this.isPlaying = false;
      this.events.onStateChange?.(PlayerState.PAUSED, this.segment);
      console.log(`⏸️ 片段 ${this.segment.id} 已暂停`);
    } catch (error) {
      console.warn(`Error pausing segment ${this.segment.id}:`, error);
      // 即使暂停失败，也要更新状态
      this.isPlaying = false;
      this.events.onStateChange?.(PlayerState.PAUSED, this.segment);
    }
  }

  // 停止播放并清理资源
  async stop(): Promise<void> {
    console.log(`🛑 停止片段 ${this.segment.id}`);
    
    this.clearTimeouts();
    
    if (this.isPlaying) {
      try {
        await this.videoContext.pause();
      } catch (error) {
        console.warn(`Error stopping segment ${this.segment.id}:`, error);
      }
    }
    
    // 断开视频节点连接
    if (this.videoNode) {
      try {
        // 先停止节点，然后断开连接
        this.videoNode.disconnect();
      } catch (error) {
        console.warn(`Error stopping/disconnecting video node for segment ${this.segment.id}:`, error);
      }
      this.videoNode = null;
    }
    
    this.isPlaying = false;
    this.isLoading = false;
    this.currentPlayPromise = null;
  }

  // 尝试播放视频的辅助方法
  private async attemptPlay(): Promise<void> {
    let playAttempts = 0;
    const maxPlayAttempts = 3;
    
    while (playAttempts < maxPlayAttempts) {
      try {
        console.log("开始播放", this.videoContext, this.videoContext.currentTime, this.videoContext.duration, this.videoNode?.startTime)
        await this.videoContext.play();
        return; // 播放成功，退出
      } catch (playError: any) {
        playAttempts++;
        
        if (playError.name === 'AbortError') {
          console.warn(`Play request was interrupted for segment ${this.segment.id} (attempt ${playAttempts}/${maxPlayAttempts})`);
          
          if (playAttempts < maxPlayAttempts) {
            // 递增延迟重试
            await new Promise(resolve => setTimeout(resolve, 50 * playAttempts));
            continue;
          } else {
            console.error(`Max play attempts reached for segment ${this.segment.id}, giving up`);
            throw new Error(`Failed to start playback for segment ${this.segment.id} after multiple attempts`);
          }
        } else {
          // 非AbortError，直接抛出
          throw playError;
        }
      }
    }
  }

  // 触发分支选择
  private async triggerBranchSelection(): Promise<void> {
    console.log(`🎯 触发分支选择，片段: ${this.segment.id} ${this.videoContext.currentTime}`);
    
    if (!this.segment.branches || this.segment.branches.length === 0) {
      console.log('❌ 没有分支选项，跳过');
      return;
    }

    console.log(`🎬 分支数量: ${this.segment.branches.length}`);

    // 获取当前帧图片
    const frameData = this.captureCurrentFrame();
    if (frameData) {
      console.log('✅ 帧数据获取成功，触发 onFrameCapture 回调');
      this.events.onFrameCapture?.(frameData, this.segment);
    } else {
      console.warn('❌ 帧数据获取失败');
    }

    // 暂停视频
    try {
      if (this.isPlaying) {
        console.log('⏸️ 暂停视频播放');
        await this.pause();
      }
      this.events.onStateChange?.(PlayerState.WAITING_FOR_CHOICE, this.segment);
      this.events.onBranchTrigger?.(this.segment, this.segment.branches);
      console.log('✅ 分支选择界面已显示');
      
      // 分支选择触发时，片段实际已结束，立即处理片段结束事件
      this.handleSegmentEnd();
    } catch (error) {
      console.warn('❌ 暂停视频时出错:', error);
      // 即使暂停失败，也要显示分支选择
      this.isPlaying = false;
      this.events.onStateChange?.(PlayerState.WAITING_FOR_CHOICE, this.segment);
      this.events.onBranchTrigger?.(this.segment, this.segment.branches);
      
      // 分支选择触发时，片段实际已结束，立即处理片段结束事件
      this.handleSegmentEnd();
    }
  }

  // 处理片段结束
  private handleSegmentEnd(): void {
    console.log(`🏁 片段结束: ${this.segment.id}`);
    this.events.onSegmentEnd?.(this.segment);
  }

  // 获取当前视频帧
  private captureCurrentFrame(): string | null {
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

  // 清理定时器
  private clearTimeouts(): void {
    if (this.branchTimeout) {
      clearTimeout(this.branchTimeout);
      this.branchTimeout = null;
    }
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }
  }

  // 错误处理
  private handleError(error: Error): void {
    console.error(`VideoSegmentPlayer error for segment ${this.segment.id}:`, error);
    this.events.onError?.(error, this.segment);
    this.events.onStateChange?.(PlayerState.ERROR, this.segment);
  }

  // 清理资源
  dispose(): void {
    console.log(`🗑️ 清理片段播放器资源: ${this.segment.id}`);
    this.stop();
  }
}

export default VideoSegmentPlayer;