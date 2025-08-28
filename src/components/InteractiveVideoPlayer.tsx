'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  InteractiveVideoConfig,
  VideoSegment,
  BranchOption,
  PlayerState,
  PlayerEvents,
  VideoContextInstance,
  VideoNode
} from '../types/interactive-video';

// 动态导入VideoContext
let VideoContext: any = null;
if (typeof window !== 'undefined') {
  import('videocontext').then((module) => {
    VideoContext = module.default || module;
  }).catch((error) => {
    console.error('Failed to load VideoContext:', error);
  });
}

interface InteractiveVideoPlayerProps {
  config: InteractiveVideoConfig;
  events?: Partial<PlayerEvents>;
  className?: string;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  config,
  events,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoContextRef = useRef<VideoContextInstance | null>(null);
  const currentVideoNodeRef = useRef<VideoNode | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.IDLE);
  const [currentSegment, setCurrentSegment] = useState<VideoSegment | null>(null);
  const [availableBranches, setAvailableBranches] = useState<BranchOption[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoContextLoaded, setIsVideoContextLoaded] = useState(false);

  // 加载VideoContext库
  useEffect(() => {
    const loadVideoContext = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        // 等待VideoContext模块加载
        let attempts = 0;
        const maxAttempts = 50; // 5秒超时
        
        const checkVideoContext = () => {
          if (VideoContext) {
            setIsVideoContextLoaded(true);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('VideoContext loading timeout');
            setPlayerState(PlayerState.ERROR);
            events?.onError?.(new Error('Failed to load VideoContext library'));
            return;
          }
          
          setTimeout(checkVideoContext, 100);
        };
        
        checkVideoContext();
      } catch (error) {
        console.error('Error loading VideoContext:', error);
        setPlayerState(PlayerState.ERROR);
        events?.onError?.(error as Error);
      }
    };

    loadVideoContext();
  }, [events]);

  // 初始化VideoContext
  useEffect(() => {
    if (!isVideoContextLoaded || !canvasRef.current || !VideoContext) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const videoCtx = new VideoContext(canvas);
      videoContextRef.current = videoCtx;
      
      // 开始播放第一个片段
      playSegment(config.startSegmentId);
    } catch (error) {
      console.error('Error initializing VideoContext:', error);
      setPlayerState(PlayerState.ERROR);
      events?.onError?.(error as Error);
    }
  }, [isVideoContextLoaded, config]);

  // 播放指定片段
  const playSegment = useCallback((segmentId: string) => {
    const segment = config.segments.find(s => s.id === segmentId);
    if (!segment || !videoContextRef.current) {
      console.error('Segment not found or VideoContext not initialized:', segmentId);
      return;
    }

    try {
      setPlayerState(PlayerState.LOADING);
      setCurrentSegment(segment);
      events?.onSegmentStart?.(segment);

      // 停止当前视频
      if (currentVideoNodeRef.current) {
        // VideoContext会自动处理节点的停止
      }

      // 创建新的视频节点
      const videoNode = videoContextRef.current.video(segment.videoUrl);
      currentVideoNodeRef.current = videoNode;

      // 连接到输出
      videoNode.connect(videoContextRef.current.destination);

      // 设置播放时间
      const startTime = segment.startTime || 0;
      const endTime = segment.endTime || segment.duration;
      
      videoNode.start(startTime);
      videoNode.stop(endTime);

      // 开始播放
      videoContextRef.current.play();
      setPlayerState(PlayerState.PLAYING);

      // 设置分支触发点监听
      if (segment.branchTriggerTime && segment.branches) {
        const triggerTimeout = setTimeout(() => {
          handleBranchTrigger(segment);
        }, segment.branchTriggerTime * 1000);

        // 清理之前的定时器
        return () => clearTimeout(triggerTimeout);
      }

      // 设置片段结束监听
      const endTimeout = setTimeout(() => {
        handleSegmentEnd(segment);
      }, (endTime - startTime) * 1000);

      return () => clearTimeout(endTimeout);
    } catch (error) {
      console.error('Error playing segment:', error);
      setPlayerState(PlayerState.ERROR);
      events?.onError?.(error as Error);
    }
  }, [config, events]);

  // 处理分支触发
  const handleBranchTrigger = useCallback((segment: VideoSegment) => {
    if (!segment.branches || segment.branches.length === 0) {
      return;
    }

    // 暂停视频
    videoContextRef.current?.pause();
    setPlayerState(PlayerState.WAITING_FOR_CHOICE);
    setAvailableBranches(segment.branches);
    events?.onBranchTrigger?.(segment, segment.branches);
  }, [events]);

  // 处理片段结束
  const handleSegmentEnd = useCallback((segment: VideoSegment) => {
    events?.onSegmentEnd?.(segment);
    
    if (segment.isEnd) {
      setPlayerState(PlayerState.ENDED);
      events?.onVideoEnd?.();
    } else if (!segment.branches || segment.branches.length === 0) {
      // 如果没有分支，寻找下一个默认片段
      const nextSegment = config.segments.find(s => s.id !== segment.id);
      if (nextSegment) {
        playSegment(nextSegment.id);
      } else {
        setPlayerState(PlayerState.ENDED);
        events?.onVideoEnd?.();
      }
    }
  }, [config, events, playSegment]);

  // 选择分支
  const selectBranch = useCallback((option: BranchOption) => {
    setAvailableBranches([]);
    events?.onBranchSelect?.(option);
    playSegment(option.nextSegmentId);
  }, [events, playSegment]);

  // 播放控制
  const play = useCallback(() => {
    if (videoContextRef.current && playerState === PlayerState.PAUSED) {
      videoContextRef.current.play();
      setPlayerState(PlayerState.PLAYING);
    }
  }, [playerState]);

  const pause = useCallback(() => {
    if (videoContextRef.current && playerState === PlayerState.PLAYING) {
      videoContextRef.current.pause();
      setPlayerState(PlayerState.PAUSED);
    }
  }, [playerState]);

  // 状态变化通知
  useEffect(() => {
    events?.onStateChange?.(playerState);
  }, [playerState, events]);

  return (
    <div className={`interactive-video-player ${className}`}>
      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes custom-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
          }
        }
        
        @keyframes custom-ripple {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        @keyframes custom-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        .animate-custom-glow {
          animation: custom-glow 2s ease-in-out infinite;
        }
        
        .animate-custom-ripple {
          animation: custom-ripple 2s ease-out infinite;
        }
        
        .animate-custom-pulse {
          animation: custom-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={config.settings?.width || 1280}
          height={config.settings?.height || 720}
          className="w-full h-auto bg-black"
        />
        
        {/* 分支选择覆盖层 */}
        {playerState === PlayerState.WAITING_FOR_CHOICE && availableBranches.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* 可配置标题 */}
            {currentSegment?.branchTitle && (
              <div 
                className={`absolute pointer-events-none ${
                   currentSegment.branchTitle.position?.x === 'left' ? 'left-0' :
                   currentSegment.branchTitle.position?.x === 'right' ? 'right-0' :
                   'left-1/2 transform -translate-x-1/2'
                 } ${
                   currentSegment.branchTitle.position?.y === 'top' ? 'top-0' :
                   currentSegment.branchTitle.position?.y === 'center' ? 'top-1/2 -translate-y-1/2' :
                   'bottom-0'
                 }`}
                style={{
                   marginLeft: currentSegment.branchTitle.position?.offsetX ? `${currentSegment.branchTitle.position.offsetX}%` : undefined,
                   marginTop: currentSegment.branchTitle.position?.offsetY ? `${currentSegment.branchTitle.position.offsetY}%` : undefined,
                   marginRight: currentSegment.branchTitle.position?.offsetX && currentSegment.branchTitle.position.x === 'right' ? `${-currentSegment.branchTitle.position.offsetX}%` : undefined,
                   marginBottom: currentSegment.branchTitle.position?.offsetY && currentSegment.branchTitle.position.y === 'bottom' ? `${-currentSegment.branchTitle.position.offsetY}%` : undefined
                 }}
               >
                 <div 
                   className={`${currentSegment.branchTitle.style?.backdropBlur ? 'backdrop-blur-sm' : ''}`}
                   style={{
                     fontSize: currentSegment.branchTitle.style?.fontSize,
                     fontWeight: currentSegment.branchTitle.style?.fontWeight,
                     color: currentSegment.branchTitle.style?.color,
                     backgroundColor: currentSegment.branchTitle.style?.backgroundColor,
                     padding: currentSegment.branchTitle.style?.padding,
                     borderRadius: currentSegment.branchTitle.style?.borderRadius,
                     border: currentSegment.branchTitle.style?.border
                   }}
                >
                  <h3 className="text-center whitespace-nowrap">{currentSegment.branchTitle.text}</h3>
                </div>
              </div>
            )}
            
            {/* 分支按钮 - 根据配置位置和样式放置 */}
             {availableBranches.map((branch, index) => {
               const position = branch.position || { x: 'center', y: 'bottom' };
               const style = branch.style || { shape: 'rectangle', size: 'medium', textPosition: 'inside' };
               
               const getPositionClasses = () => {
                 let classes = 'absolute pointer-events-auto';
                 
                 // 水平位置
                 switch (position.x) {
                   case 'left':
                     classes += ' left-8';
                     break;
                   case 'right':
                     classes += ' right-8';
                     break;
                   case 'center':
                   default:
                     classes += ' left-1/2 transform -translate-x-1/2';
                     break;
                 }
                 
                 // 垂直位置
                 switch (position.y) {
                   case 'top':
                     classes += ' top-24';
                     break;
                   case 'center':
                     classes += ' top-1/2 -translate-y-1/2';
                     if (position.x === 'center') {
                       classes = classes.replace('transform -translate-x-1/2', 'transform -translate-x-1/2 -translate-y-1/2');
                     } else {
                       classes += ' transform';
                     }
                     break;
                   case 'bottom':
                   default:
                     classes += ' bottom-8';
                     break;
                 }
                 
                 return classes;
               };
               
               const getCustomOffset = () => {
                 const offsetStyle: React.CSSProperties = {};
                 if (position.offsetX) {
                   offsetStyle.marginLeft = `${position.offsetX}%`;
                 }
                 if (position.offsetY) {
                   offsetStyle.marginTop = `${position.offsetY}%`;
                 }
                 return offsetStyle;
               };
               
               const getButtonClasses = () => {
                 let classes = 'transition-all duration-200 hover:scale-105 hover:shadow-xl font-medium backdrop-blur-sm border shadow-lg';
                 
                 // 形状
                 if (style.shape === 'circle') {
                   classes += ' rounded-full flex items-center justify-center';
                 } else {
                   classes += ' rounded-lg';
                 }
                 
                 // 大小
                 switch (style.size) {
                   case 'small':
                     classes += style.shape === 'circle' ? ' w-12 h-12' : ' px-3 py-2 text-xs';
                     break;
                   case 'large':
                     classes += style.shape === 'circle' ? ' w-20 h-20' : ' px-8 py-4 text-base';
                     break;
                   case 'medium':
                   default:
                     classes += style.shape === 'circle' ? ' w-16 h-16' : ' px-6 py-3 text-sm';
                     break;
                 }
                 
                 // 动画效果
                 if (style.animation && style.animation.type !== 'none') {
                   switch (style.animation.type) {
                     case 'pulse':
                       classes += ' animate-custom-pulse';
                       break;
                     case 'bounce':
                       classes += ' animate-bounce';
                       break;
                     case 'glow':
                       classes += ' animate-custom-glow';
                       break;
                     case 'ripple':
                       classes += ' animate-custom-ripple';
                       break;
                   }
                 }
                 
                 return classes;
               };
               
               const getButtonStyle = (): React.CSSProperties => {
                 const buttonStyle: React.CSSProperties = {
                   color: style.textColor || '#ffffff',
                   borderColor: style.borderColor || '#ffffff30'
                 };
                 
                 // 透明底色设置
                 if (style.transparent) {
                   buttonStyle.backgroundColor = 'transparent';
                   buttonStyle.border = '2px solid rgba(255, 255, 255, 0.3)';
                 } else {
                   buttonStyle.backgroundColor = style.backgroundColor || 'rgba(255, 255, 255, 0.1)';
                 }
                 
                 // 动画相关样式
                 if (style.animation) {
                   buttonStyle.animationDuration = `${style.animation.duration || 2}s`;
                   buttonStyle.animationDelay = `${style.animation.delay || 0}s`;
                   buttonStyle.animationIterationCount = style.animation.loop ? 'infinite' : '1';
                 }
                 
                 return buttonStyle;
               };
               
               const getLayoutClasses = () => {
                 if (style.textPosition === 'inside' || style.shape === 'rectangle') {
                   return 'flex flex-col items-center';
                 }
                 
                 switch (style.textPosition) {
                   case 'right':
                     return 'flex flex-row items-center gap-3';
                   case 'left':
                     return 'flex flex-row-reverse items-center gap-3';
                   case 'top':
                     return 'flex flex-col-reverse items-center gap-2';
                   case 'bottom':
                     return 'flex flex-col items-center gap-2';
                   default:
                     return 'flex flex-col items-center';
                 }
               };
               
               const renderButtonContent = () => {
                 if (style.textPosition === 'inside' || style.shape === 'rectangle') {
                   return (
                     <>
                       <div className="font-bold">{branch.label}</div>
                       {branch.description && style.shape === 'rectangle' && (
                         <div className="opacity-70 mt-1 leading-tight text-xs">{branch.description}</div>
                       )}
                     </>
                   );
                 }
                 return branch.label.charAt(0).toUpperCase();
               };
               
               const renderExternalText = () => {
                 if (style.textPosition === 'inside' || style.shape === 'rectangle') {
                   return null;
                 }
                 
                 return (
                   <div className="text-center">
                     <div className="text-white font-bold text-sm drop-shadow-lg">{branch.label}</div>
                     {branch.description && (
                       <div className="text-white/90 text-xs mt-1 drop-shadow-lg leading-tight max-w-[120px]">
                         {branch.description}
                       </div>
                     )}
                   </div>
                 );
               };
               
               return (
                 <div
                   key={branch.id}
                   className={getPositionClasses()}
                   style={getCustomOffset()}
                 >
                   <div className={getLayoutClasses()}>
                     <button
                       onClick={() => selectBranch(branch)}
                       className={getButtonClasses()}
                       style={getButtonStyle()}
                     >
                       {renderButtonContent()}
                     </button>
                     {renderExternalText()}
                   </div>
                 </div>
               );
             })}
          </div>
        )}

        {/* 加载状态 */}
        {playerState === PlayerState.LOADING && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-lg">加载中...</div>
          </div>
        )}

        {/* 错误状态 */}
        {playerState === PlayerState.ERROR && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-red-500 text-lg">播放出错</div>
          </div>
        )}

        {/* 结束状态 */}
        {playerState === PlayerState.ENDED && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-lg">视频已结束</div>
          </div>
        )}
      </div>

      {/* 控制栏 */}
      {config.settings?.showControls !== false && (
        <div className="mt-4 flex items-center justify-center space-x-4">
          {playerState === PlayerState.PLAYING ? (
            <button
              onClick={pause}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              暂停
            </button>
          ) : (
            <button
              onClick={play}
              disabled={playerState === PlayerState.WAITING_FOR_CHOICE || playerState === PlayerState.LOADING}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              播放
            </button>
          )}
          
          <div className="text-sm text-gray-600">
            状态: {playerState}
          </div>
          
          {currentSegment && (
            <div className="text-sm text-gray-600">
              当前片段: {currentSegment.id}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveVideoPlayer;