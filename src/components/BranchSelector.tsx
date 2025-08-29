'use client';

import React, { useState, useEffect } from 'react';
import { BranchOption } from '../types/interactive-video';

interface BranchSelectorProps {
  branches: BranchOption[];
  onSelect: (option: BranchOption) => void;
  isVisible: boolean;
  title?: string;
  countdown?: number; // 自动选择倒计时（秒）
  defaultChoice?: string; // 默认选择的分支ID
  className?: string;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  onSelect,
  isVisible,
  title = '选择你的路径',
  countdown,
  defaultChoice,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(countdown || null);
  const [selectedOption, setSelectedOption] = useState<BranchOption | null>(null);

  // 倒计时逻辑
  useEffect(() => {
    if (!isVisible || !countdown) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(countdown);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          // 时间到，自动选择默认选项
          const defaultOption = defaultChoice 
            ? branches.find(b => b.id === defaultChoice)
            : branches[0];
          
          if (defaultOption) {
            onSelect(defaultOption);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, countdown, defaultChoice, branches, onSelect]);

  // 重置状态当组件变为不可见时
  useEffect(() => {
    if (!isVisible) {
      setSelectedOption(null);
      setTimeLeft(countdown || null);
    }
  }, [isVisible, countdown]);

  const handleSelect = (option: BranchOption) => {
    setSelectedOption(option);
    // 添加一个小延迟以显示选择效果
    setTimeout(() => {
      onSelect(option);
    }, 200);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] ${className}`}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
        {/* 标题和倒计时 */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          {timeLeft !== null && (
            <div className="text-sm text-gray-600">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {timeLeft} 秒后自动选择
              </span>
            </div>
          )}
        </div>

        {/* 分支选项 */}
        <div className="space-y-3">
          {branches.map((branch, index) => {
            const isSelected = selectedOption?.id === branch.id;
            const isDefault = defaultChoice === branch.id;
            
            return (
              <button
                key={branch.id}
                onClick={() => handleSelect(branch)}
                disabled={selectedOption !== null}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all duration-200 transform
                  ${isSelected 
                    ? 'bg-green-500 border-green-500 text-white scale-105 shadow-lg' 
                    : isDefault && timeLeft !== null
                    ? 'bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100'
                    : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300'
                  }
                  ${selectedOption !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-102'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">{branch.label}</span>
                      {isDefault && timeLeft !== null && (
                        <span className="ml-2 px-2 py-1 text-xs bg-orange-200 text-orange-800 rounded-full">
                          默认
                        </span>
                      )}
                    </div>
                    {branch.description && (
                      <p className="text-sm mt-2 opacity-90">{branch.description}</p>
                    )}
                  </div>
                  
                  {/* 选择指示器 */}
                  <div className="ml-4 flex-shrink-0">
                    {isSelected ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-current opacity-50" />
                    )}
                  </div>
                </div>
                
                {/* 快捷键提示 */}
                <div className="mt-2 text-right">
                  <span className="text-xs opacity-60">
                    按 {index + 1} 键快速选择
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 进度条（倒计时） */}
        {timeLeft !== null && countdown && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((countdown - timeLeft) / countdown) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 提示文本 */}
        <div className="mt-4 text-center text-sm text-gray-500">
          点击选项或使用数字键 1-{branches.length} 进行选择
        </div>
      </div>
    </div>
  );
};

// 键盘快捷键Hook
export const useBranchKeyboard = (
  branches: BranchOption[],
  onSelect: (option: BranchOption) => void,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const num = parseInt(key);
      
      if (num >= 1 && num <= branches.length) {
        const selectedBranch = branches[num - 1];
        if (selectedBranch) {
          onSelect(selectedBranch);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [branches, onSelect, isActive]);
};

export default BranchSelector;