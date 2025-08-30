'use client';

import { useState } from 'react';
import { availableConfigs } from '../../data/sampleVideoConfig';

export default function DemoPage() {
  const [selectedStory, setSelectedStory] = useState('adventure');
  const [iframeKey, setIframeKey] = useState(0);

  const handleStoryChange = (storyId: string) => {
    setSelectedStory(storyId);
    // 强制重新加载iframe
    setIframeKey(prev => prev + 1);
  };

  const embedUrl = `${window.location.origin}/embed?story=${selectedStory}`;
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="1280" 
  height="720" 
  frameborder="0" 
  allowfullscreen
  style="border-radius: 8px;">
</iframe>`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">交互式视频播放器 - 嵌入演示</h1>
        
        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">选择剧情</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.keys(availableConfigs).map((storyId) => (
              <button
                key={storyId}
                onClick={() => handleStoryChange(storyId)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStory === storyId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {storyId}
              </button>
            ))}
          </div>
          
          {/* 嵌入代码 */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">嵌入代码</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{iframeCode}</pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(iframeCode)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              复制代码
            </button>
          </div>
          
          {/* 直接链接 */}
          <div>
            <h3 className="text-lg font-medium mb-2">直接链接</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={embedUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(embedUrl)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                复制链接
              </button>
              <button
                onClick={() => window.open(embedUrl, '_blank')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                新窗口打开
              </button>
            </div>
          </div>
        </div>
        
        {/* 预览区域 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">预览效果</h2>
          <div className="bg-black rounded-lg overflow-hidden">
            <iframe
              key={iframeKey}
              src={embedUrl}
              width="100%"
              height="720"
              frameBorder="0"
              allowFullScreen
              className="w-full"
              title={`Interactive Video - ${selectedStory}`}
            />
          </div>
        </div>
        
        {/* 使用说明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900">URL参数</h3>
              <p><code className="bg-gray-100 px-2 py-1 rounded">story</code> - 剧情ID，可选值: {Object.keys(availableConfigs).join(', ')}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">嵌入要求</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>建议最小尺寸: 800x450</li>
                <li>推荐尺寸: 1280x720</li>
                <li>支持响应式设计</li>
                <li>需要允许JavaScript执行</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">浏览器兼容性</h3>
              <p>支持现代浏览器，需要HTML5视频支持和Canvas API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}