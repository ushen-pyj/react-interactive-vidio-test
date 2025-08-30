'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InteractiveVideoPlayer from '../../components/InteractiveVideoPlayer';
import { availableConfigs } from '../../data/sampleVideoConfig';
import { InteractiveVideoConfig, PlayerState } from '../../types/interactive-video';

// 嵌入页面组件
function EmbedPageContent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<InteractiveVideoConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.IDLE);

  useEffect(() => {
    // 从URL参数获取剧情ID
    const storyId = searchParams.get('story');
    
    if (!storyId) {
      setError('缺少剧情ID参数。请在URL中添加 ?story=剧情ID');
      return;
    }

    // 根据剧情ID获取配置
    const selectedConfig = availableConfigs[storyId as keyof typeof availableConfigs];
    
    if (!selectedConfig) {
      setError(`未找到剧情ID "${storyId}"。可用的剧情ID: ${Object.keys(availableConfigs).join(', ')}`);
      return;
    }

    setConfig(selectedConfig as InteractiveVideoConfig);
    setError(null);
  }, [searchParams]);

  const handleStateChange = (state: PlayerState) => {
    setPlayerState(state);
  };

  const handleError = (error: Error) => {
    console.error('播放器错误:', error);
    setError(`播放错误: ${error.message}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h2 className="text-2xl font-bold mb-4">加载错误</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="text-sm text-gray-400">
            <p>使用示例:</p>
            <p className="font-mono bg-gray-800 p-2 rounded mt-2">
              {window.location.origin}/embed?story=adventure
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <InteractiveVideoPlayer
          config={config}
          events={{
            onStateChange: handleStateChange,
            onError: handleError
          }}
          className="w-full"
          isEmbedded={true}
        />
        
        {/* 状态指示器 */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800 text-white">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              playerState === PlayerState.PLAYING ? 'bg-green-500' :
              playerState === PlayerState.PAUSED ? 'bg-yellow-500' :
              playerState === PlayerState.ERROR ? 'bg-red-500' :
              'bg-gray-500'
            }`}></div>
            {playerState === PlayerState.PLAYING ? '播放中' :
             playerState === PlayerState.PAUSED ? '已暂停' :
             playerState === PlayerState.ERROR ? '错误' :
             playerState === PlayerState.WAITING_FOR_CHOICE ? '等待选择' :
             '准备中'}
          </div>
        </div>
      </div>
    </div>
  );
}

// 主页面组件，使用Suspense包装
export default function EmbedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>初始化中...</p>
        </div>
      </div>
    }>
      <EmbedPageContent />
    </Suspense>
  );
}