'use client';

import React, { useState } from 'react';
import { VideoSegment, BranchOption, ButtonPosition, TitleConfig, BackgroundAnimation } from '../types/interactive-video';
import { buttonStylePresets, titleStylePresets, ButtonStyleType, TitleStyleType } from '../utils/stylePresets';
import StyleSelector from './StyleSelector';

interface NodeEditorProps {
  segment: VideoSegment;
  onUpdateSegment: (updates: Partial<VideoSegment>) => void;
  onAddBranch: () => void;
  onUpdateBranch: (branchId: string, updates: Partial<BranchOption>) => void;
  onDeleteBranch: (branchId: string) => void;
  availableSegments: VideoSegment[];
}

export default function NodeEditor({
  segment,
  onUpdateSegment,
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  availableSegments
}: NodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'branches' | 'animation' | 'title'>('basic');
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  // 更新背景动画
  const updateBackgroundAnimation = (updates: Partial<BackgroundAnimation>) => {
    const currentAnimation = segment.backgroundAnimation || {
      type: 'horizontal',
      duration: 4,
      amplitude: 30,
      enabled: false
    };
    onUpdateSegment({
      backgroundAnimation: { ...currentAnimation, ...updates }
    });
  };

  // 更新标题配置
  const updateBranchTitle = (updates: Partial<TitleConfig>) => {
    const currentTitle = segment.branchTitle || {
      text: '',
      position: { x: 'center', y: 'top' },
      style: titleStylePresets.default
    };
    onUpdateSegment({
      branchTitle: { ...currentTitle, ...updates }
    });
  };

  // 更新分支位置
  const updateBranchPosition = (branchId: string, updates: Partial<ButtonPosition>) => {
    const branch = segment.branches?.find(b => b.id === branchId);
    if (!branch) return;
    
    const currentPosition = branch.position || { x: 'center', y: 'bottom' };
    onUpdateBranch(branchId, {
      position: { ...currentPosition, ...updates }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { key: 'basic', label: '基本信息' },
            { key: 'branches', label: '分支选项' },
            { key: 'animation', label: '动画效果' },
            { key: 'title', label: '标题配置' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* 基本信息标签页 */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">片段基本信息</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">片段ID</label>
              <input
                type="text"
                value={segment.id}
                onChange={(e) => onUpdateSegment({ id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">视频URL</label>
              <input
                type="url"
                value={segment.videoUrl}
                onChange={(e) => onUpdateSegment({ videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">播放时长 (秒)</label>
                <input
                  type="number"
                  value={segment.duration}
                  onChange={(e) => onUpdateSegment({ duration: Number(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分支触发时间 (秒)</label>
                <input
                  type="number"
                  value={segment.branchTriggerTime || ''}
                  onChange={(e) => onUpdateSegment({ branchTriggerTime: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                  max={segment.duration}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={segment.isEnd || false}
                  onChange={(e) => onUpdateSegment({ isEnd: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">结束片段</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={segment.autoNext || false}
                  onChange={(e) => onUpdateSegment({ autoNext: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">自动跳转</span>
              </label>
            </div>
          </div>
        )}

        {/* 分支选项标签页 */}
        {activeTab === 'branches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">分支选项</h3>
              <button
                onClick={onAddBranch}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + 添加分支
              </button>
            </div>

            {segment.branches && segment.branches.length > 0 ? (
              <div className="space-y-4">
                {segment.branches.map((branch, index) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">分支 {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedBranch(
                            expandedBranch === branch.id ? null : branch.id
                          )}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform ${
                              expandedBranch === branch.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteBranch(branch.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* 基本分支信息 */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">标签</label>
                        <input
                          type="text"
                          value={branch.label}
                          onChange={(e) => onUpdateBranch(branch.id, { label: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">显示文本</label>
                        <input
                          type="text"
                          value={branch.text}
                          onChange={(e) => onUpdateBranch(branch.id, { text: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">描述</label>
                      <textarea
                        value={branch.description || ''}
                        onChange={(e) => onUpdateBranch(branch.id, { description: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">跳转到片段</label>
                      <select
                        value={branch.nextSegmentId}
                        onChange={(e) => onUpdateBranch(branch.id, { nextSegmentId: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">选择目标片段</option>
                        {availableSegments.map(seg => (
                          <option key={seg.id} value={seg.id}>{seg.id}</option>
                        ))}
                      </select>
                    </div>

                    {/* 展开的详细配置 */}
                    {expandedBranch === branch.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {/* 按钮样式选择 */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">按钮样式</label>
                          <StyleSelector
                            type="button"
                            value={Object.keys(buttonStylePresets).find(key => 
                              JSON.stringify(buttonStylePresets[key as ButtonStyleType]) === 
                              JSON.stringify(branch.style)
                            ) as ButtonStyleType || 'circle-medium'}
                            onChange={(styleType) => {
                              onUpdateBranch(branch.id, { 
                                style: buttonStylePresets[styleType as ButtonStyleType] 
                              });
                            }}
                          />
                        </div>

                        {/* 位置配置 */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">按钮位置</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">水平位置</label>
                              <select
                                value={branch.position?.x || 'center'}
                                onChange={(e) => updateBranchPosition(branch.id, { 
                                  x: e.target.value as 'left' | 'center' | 'right' 
                                })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="left">左侧</option>
                                <option value="center">居中</option>
                                <option value="right">右侧</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">垂直位置</label>
                              <select
                                value={branch.position?.y || 'bottom'}
                                onChange={(e) => updateBranchPosition(branch.id, { 
                                  y: e.target.value as 'top' | 'center' | 'bottom' 
                                })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="top">顶部</option>
                                <option value="center">居中</option>
                                <option value="bottom">底部</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">X偏移 (%)</label>
                              <input
                                type="number"
                                value={branch.position?.offsetX || 0}
                                onChange={(e) => updateBranchPosition(branch.id, { 
                                  offsetX: Number(e.target.value) 
                                })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Y偏移 (%)</label>
                              <input
                                type="number"
                                value={branch.position?.offsetY || 0}
                                onChange={(e) => updateBranchPosition(branch.id, { 
                                  offsetY: Number(e.target.value) 
                                })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>暂无分支选项</p>
                <p className="text-sm">点击上方按钮添加分支</p>
              </div>
            )}
          </div>
        )}

        {/* 动画效果标签页 */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">背景动画配置</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={segment.backgroundAnimation?.enabled || false}
                onChange={(e) => updateBackgroundAnimation({ enabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">启用背景动画</span>
            </div>

            {segment.backgroundAnimation?.enabled && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">动画类型</label>
                  <select
                    value={segment.backgroundAnimation?.type || 'horizontal'}
                    onChange={(e) => updateBackgroundAnimation({ 
                      type: e.target.value as 'horizontal' | 'vertical' | 'scale' 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="horizontal">水平移动</option>
                    <option value="vertical">垂直移动</option>
                    <option value="scale">缩放</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">持续时间 (秒)</label>
                    <input
                      type="number"
                      value={segment.backgroundAnimation?.duration || 4}
                      onChange={(e) => updateBackgroundAnimation({ duration: Number(e.target.value) })}
                      min="0.1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">幅度</label>
                    <input
                      type="number"
                      value={segment.backgroundAnimation?.amplitude || 30}
                      onChange={(e) => updateBackgroundAnimation({ amplitude: Number(e.target.value) })}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 标题配置标签页 */}
        {activeTab === 'title' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">分支标题配置</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题文本</label>
              <input
                type="text"
                value={segment.branchTitle?.text || ''}
                onChange={(e) => updateBranchTitle({ text: e.target.value })}
                placeholder="输入分支选择时显示的标题"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {segment.branchTitle?.text && (
              <div className="space-y-4">
                {/* 标题样式选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标题样式</label>
                  <StyleSelector
                    type="title"
                    value={Object.keys(titleStylePresets).find(key => 
                      JSON.stringify(titleStylePresets[key as TitleStyleType]) === 
                      JSON.stringify(segment.branchTitle?.style)
                    ) as TitleStyleType || 'default'}
                    onChange={(styleType) => {
                      updateBranchTitle({ 
                        style: titleStylePresets[styleType as TitleStyleType] 
                      });
                    }}
                  />
                </div>

                {/* 标题位置配置 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标题位置</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">水平位置</label>
                      <select
                        value={segment.branchTitle?.position?.x || 'center'}
                        onChange={(e) => {
                          const currentPosition = segment.branchTitle?.position || { x: 'center', y: 'top' };
                          updateBranchTitle({ 
                            position: { 
                              ...currentPosition, 
                              x: e.target.value as 'left' | 'center' | 'right' 
                            } 
                          });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="left">左侧</option>
                        <option value="center">居中</option>
                        <option value="right">右侧</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">垂直位置</label>
                      <select
                        value={segment.branchTitle?.position?.y || 'top'}
                        onChange={(e) => {
                          const currentPosition = segment.branchTitle?.position || { x: 'center', y: 'top' };
                          updateBranchTitle({ 
                            position: { 
                              ...currentPosition, 
                              y: e.target.value as 'top' | 'center' | 'bottom' 
                            } 
                          });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="top">顶部</option>
                        <option value="center">居中</option>
                        <option value="bottom">底部</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X偏移 (%)</label>
                      <input
                        type="number"
                        value={segment.branchTitle?.position?.offsetX || 0}
                        onChange={(e) => {
                          const currentPosition = segment.branchTitle?.position || { x: 'center', y: 'top' };
                          updateBranchTitle({ 
                            position: { 
                              ...currentPosition, 
                              offsetX: Number(e.target.value) 
                            } 
                          });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y偏移 (%)</label>
                      <input
                        type="number"
                        value={segment.branchTitle?.position?.offsetY || 0}
                        onChange={(e) => {
                          const currentPosition = segment.branchTitle?.position || { x: 'center', y: 'top' };
                          updateBranchTitle({ 
                            position: { 
                              ...currentPosition, 
                              offsetY: Number(e.target.value) 
                            } 
                          });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}