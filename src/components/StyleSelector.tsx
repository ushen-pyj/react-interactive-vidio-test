'use client';

import React from 'react';
import { buttonStylePresets, titleStylePresets, ButtonStyleType, TitleStyleType } from '../utils/stylePresets';

interface StyleSelectorProps {
  type: 'button' | 'title';
  value: ButtonStyleType | TitleStyleType;
  onChange: (styleType: ButtonStyleType | TitleStyleType) => void;
}

export default function StyleSelector({ type, value, onChange }: StyleSelectorProps) {
  const presets = type === 'button' ? buttonStylePresets : titleStylePresets;
  const presetKeys = Object.keys(presets) as (ButtonStyleType | TitleStyleType)[];

  // 样式预览组件
  const StylePreview = ({ styleKey, style }: { styleKey: string; style: any }) => {
    if (type === 'button') {
      return (
        <div
          className="w-16 h-8 rounded flex items-center justify-center text-xs font-medium transition-all"
          style={{
            backgroundColor: style.backgroundColor,
            color: style.color,
            border: style.border,
            borderRadius: style.borderRadius,
            fontSize: '10px',
            transform: `scale(0.8)`
          }}
        >
          按钮
        </div>
      );
    } else {
      return (
        <div
          className="px-3 py-1 text-xs transition-all"
          style={{
            color: style.color,
            backgroundColor: style.backgroundColor,
            border: style.border,
            borderRadius: style.borderRadius,
            fontSize: style.fontSize ? `${parseInt(style.fontSize) * 0.6}px` : '10px',
            fontWeight: style.fontWeight,
            textShadow: style.textShadow
          }}
        >
          标题
        </div>
      );
    }
  };

  // 获取样式名称
  const getStyleName = (key: string) => {
    const nameMap: Record<string, string> = {
      // 按钮样式
      'circle-small': '小圆形',
      'circle-medium': '中圆形',
      'circle-large': '大圆形',
      'rounded-small': '小圆角',
      'rounded-medium': '中圆角',
      'rounded-large': '大圆角',
      'square-small': '小方形',
      'square-medium': '中方形',
      'square-large': '大方形',
      'pill-small': '小胶囊',
      'pill-medium': '中胶囊',
      'pill-large': '大胶囊',
      // 标题样式
      'default': '默认',
      'large': '大标题',
      'elegant': '优雅',
      'bold': '粗体',
      'shadow': '阴影',
      'outline': '描边',
      'gradient': '渐变'
    };
    return nameMap[key] || key;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {presetKeys.map((styleKey) => {
          const style = (presets as any)[styleKey];
          const isSelected = value === styleKey;
          
          return (
            <button
              key={styleKey}
              onClick={() => onChange(styleKey)}
              className={`p-3 border-2 rounded-lg transition-all hover:shadow-md ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <StylePreview styleKey={styleKey} style={style} />
                <span className="text-xs text-gray-600 font-medium">
                  {getStyleName(styleKey)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 当前选中样式的详细信息 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">当前样式: {getStyleName(value)}</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {Object.entries((presets as any)[value]).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className="font-mono">{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}