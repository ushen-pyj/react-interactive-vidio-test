'use client';

import { useState } from 'react';
import InteractiveVideoPlayer from '../components/InteractiveVideoPlayer';
import BranchTree from '../components/BranchTree';
import { availableConfigs } from '../data/sampleVideoConfig';
import { InteractiveVideoConfig, PlayerState } from '../types/interactive-video';

export default function Home() {
  const [selectedConfig, setSelectedConfig] = useState<InteractiveVideoConfig | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.IDLE);
  const [playbackHistory, setPlaybackHistory] = useState<string[]>([]);

  const handleConfigSelect = (configKey: string) => {
    const config = availableConfigs[configKey as keyof typeof availableConfigs];
    if (config) {
      setSelectedConfig(config);
      setPlaybackHistory([]);
    }
  };

  const handleBackToMenu = () => {
    setSelectedConfig(null);
    setPlayerState(PlayerState.IDLE);
  };

  const handleStateChange = (state: PlayerState) => {
    setPlayerState(state);
  };

  const handleSegmentStart = (segment: any) => {
    setPlaybackHistory(prev => [...prev, `开始播放: ${segment.id}`]);
  };

  const handleBranchSelect = (option: any) => {
    setPlaybackHistory(prev => [...prev, `选择分支: ${option.label}`]);
  };

  if (selectedConfig) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* 头部导航 */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回菜单
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedConfig.title}</h1>
            <div className="text-sm text-gray-600">
              状态: <span className="font-medium">{playerState}</span>
            </div>
          </div>

          {/* 视频播放器 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <InteractiveVideoPlayer
              config={selectedConfig}
              events={{
                onStateChange: handleStateChange,
                onSegmentStart: handleSegmentStart,
                onBranchSelect: handleBranchSelect,
                onError: (error) => console.error('播放器错误:', error)
              }}
              className="w-full"
            />
          </div>

          {/* 播放历史 */}
          {playbackHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">播放历史</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {playbackHistory.map((entry, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分支结构图 */}
          <BranchTree config={selectedConfig} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            互动视频框架演示
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于 VideoContext 构建的互动视频播放器，支持多分支选择和动态故事线。
            选择一个示例开始体验吧！
          </p>
        </div>

        {/* 功能特性 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h10a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">多分支选择</h3>
            <p className="text-gray-600 text-sm">
              在关键时刻暂停视频，让观众选择不同的故事走向，创造个性化的观看体验。
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">高性能播放</h3>
            <p className="text-gray-600 text-sm">
              基于 WebGL 的 VideoContext 库，提供流畅的视频播放和无缝的片段切换体验。
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">灵活配置</h3>
            <p className="text-gray-600 text-sm">
              支持复杂的视频配置，包括分支逻辑、倒计时选择、进度保存等高级功能。
            </p>
          </div>
        </div>

        {/* 示例选择 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            选择一个示例开始体验
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 冒险故事示例 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                 onClick={() => handleConfigSelect('theInvisibleGuardian')}>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    隐形守护者
                  </h3>
                  <p className="text-gray-600 mb-4">
                    一个充满选择的互动冒险故事，包含多个分支路径和不同的结局。体验复杂的故事线和决策系统。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">多分支</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">复杂故事</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">多结局</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                 onClick={() => handleConfigSelect('adventure')}>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    神秘森林冒险
                  </h3>
                  <p className="text-gray-600 mb-4">
                    一个充满选择的互动冒险故事，包含多个分支路径和不同的结局。体验复杂的故事线和决策系统。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">多分支</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">复杂故事</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">多结局</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 教程示例 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                 onClick={() => handleConfigSelect('tutorial')}>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    互动视频教程
                  </h3>
                  <p className="text-gray-600 mb-4">
                    简单的教学示例，展示互动视频的基本功能。适合初次体验和学习框架的使用方法。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">简单易懂</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">教学向</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">快速体验</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
