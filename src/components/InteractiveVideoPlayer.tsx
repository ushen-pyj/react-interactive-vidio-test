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
import VideoSequenceManager from '../utils/VideoSequenceManager';

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
  const sequenceManagerRef = useRef<VideoSequenceManager | null>(null);
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
  }, []); // 移除events依赖项

  // 初始化VideoContext和VideoSequenceManager
  useEffect(() => {
    if (!isVideoContextLoaded || !canvasRef.current || !VideoContext) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const videoCtx = new VideoContext(canvas);
      videoContextRef.current = videoCtx;
      
      // 创建VideoSequenceManager实例
      const sequenceManager = new VideoSequenceManager(config, {
        autoSave: true,
        enableHistory: true,
        preloadNext: false
      });
      
      // 设置VideoContext
      sequenceManager.setVideoContext(videoCtx);
      
      // 设置事件处理器
      sequenceManager.setEventHandlers({
        onStateChange: (state: PlayerState) => {
          setPlayerState(state);
          events?.onStateChange?.(state);
        },
        onSegmentChange: (segment: VideoSegment) => {
          setCurrentSegment(segment);
          events?.onSegmentStart?.(segment);
        },
        onBranchTrigger: (segment: VideoSegment, branches: BranchOption[]) => {
          setAvailableBranches(branches);
          events?.onBranchTrigger?.(segment, branches);
        },
        onError: (error: Error) => {
          events?.onError?.(error);
        }
      });
      
      sequenceManagerRef.current = sequenceManager;
      
      // 开始播放序列
      sequenceManager.startSequence();
    } catch (error) {
      console.error('Error initializing VideoContext:', error);
      setPlayerState(PlayerState.ERROR);
      events?.onError?.(error as Error);
    }
  }, [isVideoContextLoaded, config]); // 移除events依赖项

  // 播放指定片段（通过VideoSequenceManager）
  const playSegment = useCallback(async (segmentId: string) => {
    if (!sequenceManagerRef.current) {
      console.error('VideoSequenceManager not initialized');
      return;
    }

    try {
      await sequenceManagerRef.current.playSegmentById(segmentId);
    } catch (error) {
      console.error('Error playing segment:', error);
      events?.onError?.(error as Error);
    }
  }, []); // 移除events依赖项

  // 选择分支（通过VideoSequenceManager）
  const selectBranch = useCallback(async (option: BranchOption) => {
    if (!sequenceManagerRef.current) {
      console.error('VideoSequenceManager not initialized');
      return;
    }

    setAvailableBranches([]);
    events?.onBranchSelect?.(option);
    
    try {
      await sequenceManagerRef.current.selectBranch(option);
    } catch (error) {
      console.error('Error selecting branch:', error);
      events?.onError?.(error as Error);
    }
  }, []); // 移除events依赖项

  // 播放控制（通过VideoSequenceManager）
  const play = useCallback(async () => {
    if (!sequenceManagerRef.current || playerState !== PlayerState.PAUSED) {
      return;
    }
    
    try {
      await sequenceManagerRef.current.play();
    } catch (error) {
      console.error('Error playing video:', error);
      events?.onError?.(error as Error);
    }
  }, [playerState]); // 移除events依赖项

  const pause = useCallback(async () => {
    if (!sequenceManagerRef.current || playerState !== PlayerState.PLAYING) {
      return;
    }
    
    try {
      await sequenceManagerRef.current.pause();
    } catch (error) {
      console.error('Error pausing video:', error);
      events?.onError?.(error as Error);
    }
  }, [playerState]); // 移除events依赖项

  // 清理定时器和资源
  useEffect(() => {
    return () => {
      // 清理所有定时器
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      
      // 清理VideoSequenceManager
      if (sequenceManagerRef.current) {
        sequenceManagerRef.current.dispose();
      }
      
      // 停止视频播放
      if (videoContextRef.current) {
        try {
          videoContextRef.current.pause();
        } catch (error) {
          console.warn('Error pausing video during cleanup:', error);
        }
      }
    };
  }, []);

  // 辅助函数：根据配置生成位置样式
  const getPositionStyle = (position: any) => {
    if (!position) return {};
    
    const style: any = {};
    
    // 处理水平位置
    switch (position.x) {
      case 'left':
        style.left = `${position.offsetX || 0}px`;
        break;
      case 'right':
        style.right = `${Math.abs(position.offsetX || 0)}px`;
        break;
      case 'center':
        style.left = '50%';
        style.transform = 'translateX(-50%)';
        if (position.offsetX) {
          style.marginLeft = `${position.offsetX}px`;
        }
        break;
    }
    
    // 处理垂直位置
    switch (position.y) {
      case 'top':
        style.top = `${position.offsetY || 0}px`;
        break;
      case 'bottom':
        style.bottom = `${Math.abs(position.offsetY || 0)}px`;
        break;
      case 'center':
        style.top = '50%';
        style.transform = style.transform ? `${style.transform} translateY(-50%)` : 'translateY(-50%)';
        if (position.offsetY) {
          style.marginTop = `${position.offsetY}px`;
        }
        break;
    }
    
    return style;
  };
  
  // 辅助函数：根据配置生成按钮样式
  const getButtonStyle = (style: any) => {
    if (!style) return {};
    
    const buttonStyle: any = {
      backgroundColor: style.backgroundColor || (style.transparent ? 'transparent' : '#3b82f6'),
      color: style.textColor || '#ffffff',
      border: style.borderColor ? `2px solid ${style.borderColor}` : (style.transparent ? 'none' : '2px solid rgba(255, 255, 255, 0.3)'),
      backdropFilter: style.transparent ? 'blur(4px)' : 'none',
      transition: 'all 0.3s ease'
    };
    
    // 处理形状
    if (style.shape === 'circle') {
      buttonStyle.borderRadius = '50%';
      buttonStyle.width = getSizeValue(style.size);
      buttonStyle.height = getSizeValue(style.size);
      buttonStyle.display = 'flex';
      buttonStyle.alignItems = 'center';
      buttonStyle.justifyContent = 'center';
      buttonStyle.minWidth = getSizeValue(style.size);
      buttonStyle.minHeight = getSizeValue(style.size);
    } else {
      buttonStyle.borderRadius = '8px';
      buttonStyle.padding = getPaddingValue(style.size);
    }
    
    return buttonStyle;
  };
  
  // 辅助函数：获取尺寸值
  const getSizeValue = (size: string) => {
    switch (size) {
      case 'small': return '40px';
      case 'medium': return '60px';
      case 'large': return '80px';
      default: return '60px';
    }
  };
  
  // 辅助函数：获取内边距值
  const getPaddingValue = (size: string) => {
    switch (size) {
      case 'small': return '8px 16px';
      case 'medium': return '12px 24px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  };
  
  // 辅助函数：获取动画类名
  const getAnimationClass = (animation: any) => {
    if (!animation) return '';
    
    switch (animation.type) {
      case 'glow': return 'animate-custom-glow';
      case 'ripple': return 'animate-custom-ripple';
      case 'pulse': return 'animate-custom-pulse';
      case 'bounce': return 'animate-custom-bounce';
      default: return '';
    }
  };
  
  // 辅助函数：渲染按钮内容
  const renderButtonContent = (branch: BranchOption) => {
    const style = branch.style;
    if (!style || style.textPosition === 'inside') {
      return branch.label;
    }
    return ''; // 文字在外部显示时，按钮内部为空
  };
  
  // 辅助函数：渲染外部文字
  const renderExternalText = (branch: BranchOption) => {
    const style = branch.style;
    if (!style || style.textPosition === 'inside') {
      return null;
    }
    
    const textStyle: any = {
      color: style.textColor || '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      whiteSpace: 'nowrap'
    };
    
    const textPositionStyle: any = {
      position: 'absolute',
      pointerEvents: 'none'
    };
    
    switch (style.textPosition) {
      case 'top':
        textPositionStyle.bottom = '100%';
        textPositionStyle.left = '50%';
        textPositionStyle.transform = 'translateX(-50%)';
        textPositionStyle.marginBottom = '8px';
        break;
      case 'bottom':
        textPositionStyle.top = '100%';
        textPositionStyle.left = '50%';
        textPositionStyle.transform = 'translateX(-50%)';
        textPositionStyle.marginTop = '8px';
        break;
      case 'left':
        textPositionStyle.right = '100%';
        textPositionStyle.top = '50%';
        textPositionStyle.transform = 'translateY(-50%)';
        textPositionStyle.marginRight = '8px';
        break;
      case 'right':
        textPositionStyle.left = '100%';
        textPositionStyle.top = '50%';
        textPositionStyle.transform = 'translateY(-50%)';
        textPositionStyle.marginLeft = '8px';
        break;
    }
    
    return (
      <div style={{ ...textStyle, ...textPositionStyle }}>
        {branch.label}
      </div>
    );
  };

  return (
    <div className={`interactive-video-player ${className}`}>

      {/* 视频容器 */}
      <div className="video-container relative w-full h-full bg-black rounded-lg overflow-hidden">
        {/* VideoContext Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
        {/* 分支选择覆盖层 - 透明背景，支持配置位置和样式 */}
        {availableBranches.length > 0 && currentSegment && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* 分支标题 */}
            {currentSegment.branchTitle && (
              <div
                className="absolute pointer-events-auto"
                style={{
                  ...getPositionStyle(currentSegment.branchTitle.position),
                  ...currentSegment.branchTitle.style,
                  backdropFilter: currentSegment.branchTitle.style?.backdropBlur ? 'blur(8px)' : 'none'
                }}
              >
                {currentSegment.branchTitle.text}
              </div>
            )}
            
            {/* 分支按钮 */}
            {availableBranches.map((branch, index) => {
              const buttonStyle = getButtonStyle(branch.style);
              const positionStyle = getPositionStyle(branch.position);
              const animationClass = getAnimationClass(branch.style?.animation);
              
              return (
                <div
                  key={branch.id}
                  className={`absolute pointer-events-auto ${animationClass}`}
                  style={{
                    ...positionStyle,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <button
                    onClick={() => selectBranch(branch)}
                    className={`focus:outline-none ${branch.style?.shape === 'circle' ? 'interactive-video-circle-button' : 'interactive-video-rect-button'}`}
                    style={{
                      ...buttonStyle,
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)',
                      outline: 'none',
                      border: buttonStyle.border || 'none'
                    }}
                    title={branch.description}
                  >
                    {renderButtonContent(branch)}
                  </button>
                  {renderExternalText(branch)}
                </div>
              );
            })}
          </div>
        )}

        {/* 加载状态 */}
        {playerState === PlayerState.LOADING && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="text-white text-lg animate-custom-pulse">加载中...</div>
          </div>
        )}

        {/* 错误状态 */}
        {playerState === PlayerState.ERROR && (
          <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-white text-lg">播放出错，请重试</div>
          </div>
        )}

        {/* 结束状态 */}
        {playerState === PlayerState.ENDED && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-white text-xl">视频已结束</div>
          </div>
        )}
      </div>

      {/* 播放控制栏 */}
      <div className="controls mt-4 flex items-center justify-center gap-4">
        {playerState === PlayerState.PLAYING ? (
          <button
            onClick={pause}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            暂停
          </button>
        ) : (
          <button
            onClick={play}
            disabled={playerState === PlayerState.LOADING || playerState === PlayerState.WAITING_FOR_CHOICE}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            播放
          </button>
        )}
        
        <div className="text-sm text-gray-600">
          当前片段: {currentSegment?.id || '无'}
        </div>
      </div>
    </div>
  );
};

export default InteractiveVideoPlayer;