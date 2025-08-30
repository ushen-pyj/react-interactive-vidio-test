'use client';

import React, { useState } from 'react';
import { BackgroundAnimation } from '../types/interactive-video';

interface AnimationSelectorProps {
  value: BackgroundAnimation;
  onChange: (animation: BackgroundAnimation) => void;
}

const animationPresets = {
  none: {
    type: 'horizontal' as const,
    duration: 0,
    amplitude: 0,
    enabled: false
  },
  gentle: {
    type: 'horizontal' as const,
    duration: 8,
    amplitude: 15,
    enabled: true
  },
  moderate: {
    type: 'horizontal' as const,
    duration: 4,
    amplitude: 30,
    enabled: true
  },
  strong: {
    type: 'horizontal' as const,
    duration: 2,
    amplitude: 50,
    enabled: true
  },
  verticalGentle: {
    type: 'vertical' as const,
    duration: 6,
    amplitude: 20,
    enabled: true
  },
  verticalStrong: {
    type: 'vertical' as const,
    duration: 3,
    amplitude: 40,
    enabled: true
  },
  scaleGentle: {
    type: 'scale' as const,
    duration: 10,
    amplitude: 5,
    enabled: true
  },
  scaleStrong: {
    type: 'scale' as const,
    duration: 5,
    amplitude: 15,
    enabled: true
  }
};

type AnimationPresetKey = keyof typeof animationPresets;

export default function AnimationSelector({ value, onChange }: AnimationSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<AnimationPresetKey>('none');
  const [showCustom, setShowCustom] = useState(false);

  // 获取预设名称
  const getPresetName = (key: AnimationPresetKey) => {
    const nameMap: Record<AnimationPresetKey, string> = {
      none: '无动画',
      gentle: '轻柔水平',
      moderate: '适中水平',
      strong: '强烈水平',
      verticalGentle: '轻柔垂直',
      verticalStrong: '强烈垂直',
      scaleGentle: '轻柔缩放',
      scaleStrong: '强烈缩放'
    };
    return nameMap[key];
  };

  // 获取预设描述
  const getPresetDescription = (key: AnimationPresetKey) => {
    const preset = animationPresets[key];
    if (!preset.enabled) return '禁用背景动画';
    return `${preset.type === 'horizontal' ? '水平' : preset.type === 'vertical' ? '垂直' : '缩放'}移动，${preset.duration}秒，幅度${preset.amplitude}`;
  };

  // 应用预设
  const applyPreset = (presetKey: AnimationPresetKey) => {
    setSelectedPreset(presetKey);
    onChange(animationPresets[presetKey]);
    setShowCustom(false);
  };

  // 更新自定义值
  const updateCustomValue = (updates: Partial<BackgroundAnimation>) => {
    onChange({ ...value, ...updates });
  };

  // 动画预览组件
  const AnimationPreview = ({ animation }: { animation: BackgroundAnimation }) => {
    if (!animation.enabled) {
      return (
        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">静止</span>
        </div>
      );
    }

    const animationStyle = {
      animation: `${animation.type}Animation ${animation.duration}s ease-in-out infinite alternate`
    };

    return (
      <div className="w-16 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded overflow-hidden relative">
        <div
          className="w-full h-full bg-white opacity-30 rounded"
          style={animationStyle}
        />
        <style jsx>{`
          @keyframes horizontalAnimation {
            0% { transform: translateX(-${animation.amplitude}%); }
            100% { transform: translateX(${animation.amplitude}%); }
          }
          @keyframes verticalAnimation {
            0% { transform: translateY(-${animation.amplitude}%); }
            100% { transform: translateY(${animation.amplitude}%); }
          }
          @keyframes scaleAnimation {
            0% { transform: scale(${1 - (animation.amplitude || 0) / 100}); }
            100% { transform: scale(${1 + (animation.amplitude || 0) / 100}); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 预设选择 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">动画预设</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(animationPresets) as AnimationPresetKey[]).map((presetKey) => {
            const preset = animationPresets[presetKey];
            const isSelected = selectedPreset === presetKey;
            
            return (
              <button
                key={presetKey}
                onClick={() => applyPreset(presetKey)}
                className={`p-3 border-2 rounded-lg transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <AnimationPreview animation={preset} />
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-800">
                      {getPresetName(presetKey)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getPresetDescription(presetKey)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 自定义配置切换 */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">自定义配置</h4>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showCustom ? '隐藏' : '显示'}自定义选项
        </button>
      </div>

      {/* 自定义配置面板 */}
      {showCustom && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* 启用开关 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value.enabled}
              onChange={(e) => updateCustomValue({ enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">启用背景动画</span>
          </div>

          {value.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-blue-200">
              {/* 动画类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">动画类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'horizontal', label: '水平移动' },
                    { value: 'vertical', label: '垂直移动' },
                    { value: 'scale', label: '缩放' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateCustomValue({ type: option.value as any })}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        value.type === option.value
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 持续时间 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  持续时间: {value.duration}秒
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={value.duration}
                  onChange={(e) => updateCustomValue({ duration: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5s</span>
                  <span>20s</span>
                </div>
              </div>

              {/* 幅度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  动画幅度: {value.amplitude}{value.type === 'scale' ? '%' : 'px'}
                </label>
                <input
                  type="range"
                  min={value.type === 'scale' ? '1' : '5'}
                  max={value.type === 'scale' ? '50' : '100'}
                  step={value.type === 'scale' ? '1' : '5'}
                  value={value.amplitude}
                  onChange={(e) => updateCustomValue({ amplitude: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{value.type === 'scale' ? '1%' : '5px'}</span>
                  <span>{value.type === 'scale' ? '50%' : '100px'}</span>
                </div>
              </div>

              {/* 实时预览 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">实时预览</label>
                <div className="flex items-center justify-center p-4 bg-white rounded-lg border">
                  <AnimationPreview animation={value} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 当前配置摘要 */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-1">当前配置</h5>
        <div className="text-sm text-blue-700">
          {!value.enabled ? (
            '背景动画已禁用'
          ) : (
            `${value.type === 'horizontal' ? '水平' : value.type === 'vertical' ? '垂直' : '缩放'}动画，持续${value.duration}秒，幅度${value.amplitude}${value.type === 'scale' ? '%' : 'px'}`
          )}
        </div>
      </div>
    </div>
  );
}