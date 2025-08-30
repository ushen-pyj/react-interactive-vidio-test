import {
  InteractiveVideoConfig,
  VideoSegment,
  BranchOption,
  PlayerState,
  VideoContextInstance
} from '../types/interactive-video';
import { VideoSegmentPlayer } from './VideoSegmentPlayer';

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

// 视频序列管理器类 - 重构后作为管理器协调多个VideoSegmentPlayer实例
export class VideoSequenceManager {
  private config: InteractiveVideoConfig;
  private videoContext!: VideoContextInstance;
  private sequenceConfig: SequenceManagerConfig;
  
  // 播放器实例管理
  private currentPlayer: VideoSegmentPlayer | null = null;
  // 历史记录和状态
  private playbackHistory: PlaybackHistory[] = [];
  private currentSegmentId: string | null = null;
  private totalPlayedTime: number = 0; // 累积播放时间
  
  // 事件回调
  private onStateChange?: (state: PlayerState) => void;
  private onBranchSelection?: (segment: VideoSegment, branches: BranchOption[]) => void;
  private onSegmentComplete?: (segment: VideoSegment) => void;
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
    
    console.log('🎬 VideoSequenceManager 初始化完成');
  }

  // 设置视频上下文
  setVideoContext(videoContext: VideoContextInstance): void {
    this.videoContext = videoContext;
  }

  // 设置事件处理器（兼容InteractiveVideoPlayer的调用方式）
  setEventHandlers(handlers: {
    onStateChange?: (state: PlayerState) => void;
    onBranchSelection?: (segment: VideoSegment, branches: BranchOption[]) => void;
    onSegmentComplete?: (segment: VideoSegment) => void;
    onError?: (error: Error) => void;
    onFrameCapture?: (frameData: string, segment: VideoSegment) => void;
  }): void {
    this.setEventCallbacks(handlers);
  }

  // 设置事件回调
  setEventCallbacks(callbacks: {
    onStateChange?: (state: PlayerState) => void;
    onBranchSelection?: (segment: VideoSegment, branches: BranchOption[]) => void;
    onSegmentComplete?: (segment: VideoSegment) => void;
    onError?: (error: Error) => void;
    onFrameCapture?: (frameData: string, segment: VideoSegment) => void;
  }): void {
    this.onStateChange = callbacks.onStateChange;
    this.onBranchSelection = callbacks.onBranchSelection;
    this.onSegmentComplete = callbacks.onSegmentComplete;
    this.onError = callbacks.onError;
    this.onFrameCapture = callbacks.onFrameCapture;
  }

  // 开始播放序列
  async startSequence(startSegmentId?: string): Promise<void> {
    const segmentId = startSegmentId || this.config.startSegmentId;
    const segment = this.getSegmentById(segmentId);
    
    if (!segment) {
      throw new Error(`Segment not found: ${segmentId}`);
    }

    // 重置累积播放时间
    this.totalPlayedTime = 0;
    
    console.log(`🎬 开始播放序列，起始片段: ${segmentId}`);
    await this.playSegmentById(segmentId);
  }

  // 播放指定片段
  async playSegmentById(segmentId: string): Promise<void> {
    const segment = this.getSegmentById(segmentId);
    if (!segment) {
      throw new Error(`Segment not found: ${segmentId}`);
    }

    // 停止当前播放器
    if (this.currentPlayer) {
      await this.currentPlayer.stop();
      this.currentPlayer.dispose();
      // 确保当前播放器完全清理后再继续
      this.currentPlayer = null;
    }

    // 添加短暂延迟确保videoContext状态稳定
    await new Promise(resolve => setTimeout(resolve, 50));

    // 创建播放器实例，使用累积时间作为起始时间
    let player = this.createPlayerInstance(segment, this.totalPlayedTime);

    // 设置为当前播放器并开始播放
    this.currentPlayer = player;
    this.currentSegmentId = segmentId;
    
    // 更新累积播放时间
    this.totalPlayedTime += segment.duration;
    
    // 添加到历史记录
    this.addToHistory(segmentId);
    
    // 开始播放
    await player.play();
  }

  // 创建播放器实例
  private createPlayerInstance(segment: VideoSegment, startTime: number): VideoSegmentPlayer {
    return new VideoSegmentPlayer(segment, this.videoContext, startTime, {
      onStateChange: (state, seg) => {
        console.log(`🔄 播放器状态变化: ${seg.id} -> ${state}`);
        this.onStateChange?.(state);
      },
      onBranchTrigger: (seg, branches) => {
        console.log(`🎯 分支触发: ${seg.id}`);
        this.onBranchSelection?.(seg, branches);
      },
      onSegmentEnd: (seg) => {
        console.log(`🏁 片段结束: ${seg.id}`);
        this.handleSegmentEnd(seg);
      },
      onError: (error, seg) => {
        console.error(`❌ 播放器错误: ${seg.id}`, error);
        this.onError?.(error);
      },
      onFrameCapture: (frameData, seg) => {
        console.log(`📸 帧捕获: ${seg.id}`);
        this.onFrameCapture?.(frameData, seg);
      }
    });
  }

  // 选择分支
  async selectBranch(branchOption: BranchOption): Promise<void> {
    console.log(`🎯 选择分支: ${branchOption.text} -> ${branchOption.nextSegmentId} 当前ctx播放时间 ${this.videoContext.currentTime}`);
    
    try {
      // 验证目标片段存在
      const targetSegment = this.getSegmentById(branchOption.nextSegmentId);
      if (!targetSegment) {
        throw new Error(`Target segment not found: ${branchOption.nextSegmentId}`);
      }
      
      console.log(`✅ 目标片段验证成功: ${targetSegment.id}, URL: ${targetSegment.videoUrl}`);
      
      // 更新历史记录中的分支选择
      this.updateHistoryWithBranch(branchOption);
      
      // 播放下一个片段
      await this.playSegmentById(branchOption.nextSegmentId);
      
      console.log(`🎬 分支切换完成: ${branchOption.nextSegmentId}`);
    } catch (error) {
      console.error(`❌ 分支选择失败:`, error);
      this.handleError(error as Error);
      throw error;
    }
  }

  // 处理片段结束
  private async handleSegmentEnd(segment: VideoSegment): Promise<void> {
    console.log(`🏁 处理片段结束: ${segment.id}`);
    
    this.onSegmentComplete?.(segment);
    
    // 如果有默认的下一个片段，自动播放
    const nextSegment = this.findNextSegment(segment);
    if (nextSegment) {
      console.log(`➡️ 自动播放下一个片段: ${nextSegment.id}`);
      await this.playSegmentById(nextSegment.id);
    } else {
      console.log('🎬 序列播放完成');
    }
  }

  // 查找下一个片段
  private findNextSegment(currentSegment: VideoSegment): VideoSegment | null {
    // 如果设置了autoNext，自动选择第一个分支
    if (currentSegment.autoNext && currentSegment.branches && currentSegment.branches.length > 0) {
      const firstBranch = currentSegment.branches[0];
      return this.getSegmentById(firstBranch.nextSegmentId);
    }
    
    // 如果有分支但没有设置autoNext，不自动播放下一个
    if (currentSegment.branches && currentSegment.branches.length > 0) {
      return null;
    }
    
    // 查找默认的下一个片段（这里可以根据具体逻辑实现）
    // 暂时返回null，表示需要用户选择或序列结束
    return null;
  }

  // 获取片段信息
  private getSegmentById(segmentId: string): VideoSegment | null {
    return this.config.segments.find(segment => segment.id === segmentId) || null;
  }

  // 添加到历史记录
  private addToHistory(segmentId: string): void {
    if (!this.sequenceConfig.enableHistory) return;
    
    this.playbackHistory.push({
      segmentId,
      timestamp: Date.now()
    });
    
    console.log(`📝 添加到历史记录: ${segmentId}`);
    
    if (this.sequenceConfig.autoSave) {
      this.saveProgress();
    }
  }

  // 更新历史记录中的分支选择
  private updateHistoryWithBranch(branchOption: BranchOption): void {
    if (!this.sequenceConfig.enableHistory || this.playbackHistory.length === 0) return;
    
    const lastEntry = this.playbackHistory[this.playbackHistory.length - 1];
    lastEntry.branchChoice = branchOption;
    
    console.log(`📝 更新历史记录分支选择: ${branchOption.text}`);
    
    if (this.sequenceConfig.autoSave) {
      this.saveProgress();
    }
  }

  // 保存进度
  private saveProgress(): void {
    try {
      const progressData = {
        currentSegmentId: this.currentSegmentId,
        playbackHistory: this.playbackHistory,
        timestamp: Date.now()
      };
      
      localStorage.setItem('videoSequenceProgress', JSON.stringify(progressData));
      console.log('💾 进度已保存');
    } catch (error) {
      console.warn('❌ 保存进度失败:', error);
    }
  }

  // 加载进度
  loadProgress(): boolean {
    try {
      const savedData = localStorage.getItem('videoSequenceProgress');
      if (!savedData) return false;
      
      const progressData = JSON.parse(savedData);
      this.currentSegmentId = progressData.currentSegmentId;
      this.playbackHistory = progressData.playbackHistory || [];
      
      console.log('📂 进度已加载');
      return true;
    } catch (error) {
      console.warn('❌ 加载进度失败:', error);
      return false;
    }
  }

  // 清除进度
  clearProgress(): void {
    try {
      localStorage.removeItem('videoSequenceProgress');
      this.playbackHistory = [];
      this.currentSegmentId = null;
      console.log('🗑️ 进度已清除');
    } catch (error) {
      console.warn('❌ 清除进度失败:', error);
    }
  }

  // 获取播放历史
  getPlaybackHistory(): PlaybackHistory[] {
    return [...this.playbackHistory];
  }

  // 获取当前片段
  getCurrentSegment(): VideoSegment | null {
    if (!this.currentSegmentId) return null;
    return this.getSegmentById(this.currentSegmentId);
  }

  // 播放控制
  async play(): Promise<void> {
    if (this.currentPlayer) {
      await this.currentPlayer.play();
    }
  }

  async pause(): Promise<void> {
    if (this.currentPlayer) {
      await this.currentPlayer.pause();
    }
  }

  // 错误处理
  private handleError(error: Error): void {
    console.error('VideoSequenceManager error:', error);
    this.onError?.(error);
  }

  // 清理资源
  dispose(): void {
    console.log('🗑️ 清理VideoSequenceManager资源');
    
    // 停止当前播放器
    if (this.currentPlayer) {
      this.currentPlayer.dispose();
    }

    
    // 重置状态
    this.currentPlayer = null;
    this.currentSegmentId = null;
    this.totalPlayedTime = 0;
  }
}

// 导出所有相关类和接口，保持向后兼容性
export { VideoSegmentPlayer } from './VideoSegmentPlayer';
export type { PlaybackHistory, SequenceManagerConfig };

export default VideoSequenceManager;