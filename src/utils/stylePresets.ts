// 样式预设工具 - 用于按钮和标题的样式复用

import { ButtonStyle, ButtonAnimation } from '../types/interactive-video';

// 标题样式类型
export type TitleStyleType = 'default' | 'forest' | 'village' | 'mystery' | 'elegant';

// 按钮样式类型
export type ButtonStyleType = 'circle-large' | 'circle-medium' | 'circle-small' | 'rectangle' | 'transparent';

// 动画类型 - 与ButtonAnimation保持一致
export type AnimationType = 'none' | 'pulse' | 'bounce' | 'glow' | 'ripple';

// 文本位置类型
export type TextPosition = 'inside' | 'right' | 'left' | 'top' | 'bottom';

// 标题样式配置接口
export interface TitleStyleConfig {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  backdropBlur?: boolean;
}

// 按钮样式配置接口 - 继承自ButtonStyle
export interface ButtonStyleConfig extends ButtonStyle {}

// 预设标题样式
export const titleStylePresets: Record<TitleStyleType, TitleStyleConfig> = {
  default: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: 'transparent',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    backdropBlur: false
  },
  forest: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#22c55e',
    backgroundColor: '#000000dd',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '2px solid #22c55e',
    backdropBlur: true
  },
  village: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#3b82f6',
    backgroundColor: '#000000bb',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #3b82f6',
    backdropBlur: true
  },
  mystery: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#8b5cf6',
    backgroundColor: '#000000cc',
    padding: '14px 28px',
    borderRadius: '10px',
    border: '2px solid #8b5cf6',
    backdropBlur: true
  },
  elegant: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#f59e0b',
    backgroundColor: '#00000088',
    padding: '10px 20px',
    borderRadius: '15px',
    border: '1px solid #f59e0b',
    backdropBlur: true
  }
};

// 预设按钮样式
export const buttonStylePresets: Record<ButtonStyleType, ButtonStyle> = {
  'circle-large': {
    shape: 'circle',
    size: 'large',
    textPosition: 'right',
    textColor: '#ffffff',
    backgroundColor: '#ffffff33',
    borderColor: '#ffffff88',
    transparent: false,
    animation: {
      type: 'pulse',
      duration: 2,
      loop: true
    }
  },
  'circle-medium': {
    shape: 'circle',
    size: 'medium',
    textPosition: 'bottom',
    textColor: '#ffffff',
    transparent: true,
    animation: {
      type: 'ripple',
      duration: 2.5,
      loop: true
    }
  },
  'circle-small': {
    shape: 'circle',
    size: 'small',
    textPosition: 'top',
    textColor: '#ffffff',
    transparent: true,
    animation: {
      type: 'pulse',
      duration: 1.2,
      loop: true
    }
  },
  rectangle: {
    shape: 'rectangle',
    size: 'medium',
    textPosition: 'inside',
    textColor: '#ffffff',
    transparent: true,
    animation: {
      type: 'bounce',
      duration: 1,
      loop: true
    }
  },
  transparent: {
    shape: 'circle',
    size: 'medium',
    textPosition: 'left',
    textColor: '#ffffff',
    backgroundColor: '#ffffff22',
    borderColor: '#ffffff66',
    transparent: false,
    animation: {
      type: 'glow',
      duration: 1.5,
      loop: true
    }
  }
};

// 创建标题样式的工具函数
export function createTitleStyle(
  styleType: TitleStyleType,
  customOverrides?: Partial<TitleStyleConfig>
): TitleStyleConfig {
  const baseStyle = titleStylePresets[styleType];
  return { ...baseStyle, ...customOverrides };
}

// 创建按钮样式的工具函数
export function createButtonStyle(
  styleType: ButtonStyleType,
  customOverrides?: Partial<ButtonStyle>
): ButtonStyle {
  const baseStyle = buttonStylePresets[styleType];
  return { ...baseStyle, ...customOverrides };
}

// 快速创建动画配置
export function createAnimation(
  type: AnimationType,
  duration: number = 2,
  loop: boolean = true
): ButtonAnimation {
  return { type, duration, loop };
}

// 样式工具类
export class StyleUtils {
  // 获取标题样式
  static getTitleStyle(styleType: TitleStyleType, overrides?: Partial<TitleStyleConfig>) {
    return createTitleStyle(styleType, overrides);
  }

  // 获取按钮样式
  static getButtonStyle(styleType: ButtonStyleType, overrides?: Partial<ButtonStyle>) {
    return createButtonStyle(styleType, overrides);
  }

  // 创建自定义标题样式
  static createCustomTitleStyle(config: TitleStyleConfig): TitleStyleConfig {
    return {
      fontSize: '20px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: 'transparent',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      backdropBlur: false,
      ...config
    };
  }

  // 创建自定义按钮样式
  static createCustomButtonStyle(config: Partial<ButtonStyle>): ButtonStyle {
    return {
      shape: 'circle',
      size: 'medium',
      textPosition: 'right',
      textColor: '#ffffff',
      transparent: true,
      animation: {
        type: 'pulse',
        duration: 2,
        loop: true
      },
      ...config
    };
  }
}

export default StyleUtils;