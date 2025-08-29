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

// 预设标题样式 - 使用CSS变量
export const titleStylePresets: Record<TitleStyleType, TitleStyleConfig> = {
  default: {
    fontSize: 'var(--iv-title-default-font-size)',
    fontWeight: 'var(--iv-title-default-font-weight)',
    color: 'var(--iv-title-default-color)',
    backgroundColor: 'var(--iv-title-default-bg-color)',
    padding: 'var(--iv-title-default-padding)',
    borderRadius: 'var(--iv-title-default-border-radius)',
    border: 'var(--iv-title-default-border)',
    backdropBlur: false
  },
  forest: {
    fontSize: 'var(--iv-title-forest-font-size)',
    fontWeight: 'var(--iv-title-forest-font-weight)',
    color: 'var(--iv-title-forest-color)',
    backgroundColor: 'var(--iv-title-forest-bg-color)',
    padding: 'var(--iv-title-forest-padding)',
    borderRadius: 'var(--iv-title-forest-border-radius)',
    border: 'var(--iv-title-forest-border)',
    backdropBlur: true
  },
  village: {
    fontSize: 'var(--iv-title-village-font-size)',
    fontWeight: 'var(--iv-title-village-font-weight)',
    color: 'var(--iv-title-village-color)',
    backgroundColor: 'var(--iv-title-village-bg-color)',
    padding: 'var(--iv-title-village-padding)',
    borderRadius: 'var(--iv-title-village-border-radius)',
    border: 'var(--iv-title-village-border)',
    backdropBlur: true
  },
  mystery: {
    fontSize: 'var(--iv-title-mystery-font-size)',
    fontWeight: 'var(--iv-title-mystery-font-weight)',
    color: 'var(--iv-title-mystery-color)',
    backgroundColor: 'var(--iv-title-mystery-bg-color)',
    padding: 'var(--iv-title-mystery-padding)',
    borderRadius: 'var(--iv-title-mystery-border-radius)',
    border: 'var(--iv-title-mystery-border)',
    backdropBlur: true
  },
  elegant: {
    fontSize: 'var(--iv-title-elegant-font-size)',
    fontWeight: 'var(--iv-title-elegant-font-weight)',
    color: 'var(--iv-title-elegant-color)',
    backgroundColor: 'var(--iv-title-elegant-bg-color)',
    padding: 'var(--iv-title-elegant-padding)',
    borderRadius: 'var(--iv-title-elegant-border-radius)',
    border: 'var(--iv-title-elegant-border)',
    backdropBlur: true
  }
};

// 预设按钮样式
export const buttonStylePresets: Record<ButtonStyleType, ButtonStyle> = {
  'circle-large': {
    shape: 'circle',
    size: 'large',
    textPosition: 'right',
    textColor: 'var(--iv-button-circle-large-text-color)',
    backgroundColor: 'var(--iv-button-circle-large-bg-color)',
    borderColor: 'var(--iv-button-circle-large-border-color)',
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
    textColor: 'var(--iv-button-circle-medium-text-color)',
    backgroundColor: 'var(--iv-button-circle-medium-bg-color)',
    borderColor: 'var(--iv-button-circle-medium-border-color)',
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
    textColor: 'var(--iv-button-circle-small-text-color)',
    backgroundColor: 'var(--iv-button-circle-small-bg-color)',
    borderColor: 'var(--iv-button-circle-small-border-color)',
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
    textColor: 'var(--iv-button-rectangle-text-color)',
    backgroundColor: 'var(--iv-button-rectangle-bg-color)',
    borderColor: 'var(--iv-button-rectangle-border-color)',
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
    textColor: 'var(--iv-button-transparent-text-color)',
    backgroundColor: 'var(--iv-button-transparent-bg-color)',
    borderColor: 'var(--iv-button-transparent-border-color)',
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

// 获取标题样式的Tailwind CSS类名
export function getTitleStyleClasses(styleType: TitleStyleType): string {
  const baseClasses = [
    `text-iv-title-${styleType}`,
    `bg-iv-title-bg-${styleType}`,
    `text-iv-title-${styleType}`,
    `font-iv-title-${styleType}`,
    `p-iv-title-${styleType}`,
    `rounded-iv-title-${styleType}`
  ];
  
  // 添加背景模糊类
  if (styleType !== 'default') {
    baseClasses.push(`backdrop-blur-iv-title-${styleType}`);
  }
  
  return baseClasses.join(' ');
}

// 获取标题样式的完整配置（包含CSS类名和内联样式）
export function getTitleStyleConfig(styleType: TitleStyleType): {
  className: string;
  style: TitleStyleConfig;
} {
  return {
    className: getTitleStyleClasses(styleType),
    style: titleStylePresets[styleType]
  };
}

// 获取按钮样式的Tailwind CSS类名
export function getButtonStyleClasses(styleType: ButtonStyleType): string {
  const baseClasses = [
    `text-iv-button-text-${styleType}`,
    `bg-iv-button-bg-${styleType}`,
    `border-iv-button-border-${styleType}`
  ];
  
  return baseClasses.join(' ');
}

// 获取按钮样式的完整配置（包含CSS类名和内联样式）
export function getButtonStyleConfig(styleType: ButtonStyleType): {
  className: string;
  style: ButtonStyle;
} {
  return {
    className: getButtonStyleClasses(styleType),
    style: buttonStylePresets[styleType]
  };
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

  // 获取标题样式的Tailwind CSS类名
  static getTitleStyleClasses(styleType: TitleStyleType): string {
    return getTitleStyleClasses(styleType);
  }

  // 获取标题样式的完整配置
  static getTitleStyleConfig(styleType: TitleStyleType) {
    return getTitleStyleConfig(styleType);
  }

  // 获取按钮样式的Tailwind CSS类名
  static getButtonStyleClasses(styleType: ButtonStyleType): string {
    return getButtonStyleClasses(styleType);
  }

  // 获取按钮样式的完整配置
  static getButtonStyleConfig(styleType: ButtonStyleType) {
    return getButtonStyleConfig(styleType);
  }

  // 创建自定义标题样式 - 使用CSS变量作为默认值
  static createCustomTitleStyle(config: TitleStyleConfig): TitleStyleConfig {
    return {
      fontSize: 'var(--iv-title-default-font-size)',
      fontWeight: 'var(--iv-title-default-font-weight)',
      color: 'var(--iv-title-default-color)',
      backgroundColor: 'var(--iv-title-default-bg-color)',
      padding: 'var(--iv-title-default-padding)',
      borderRadius: 'var(--iv-title-default-border-radius)',
      border: 'var(--iv-title-default-border)',
      backdropBlur: false,
      ...config
    };
  }

  // 创建自定义按钮样式 - 使用CSS变量作为默认值
  static createCustomButtonStyle(config: Partial<ButtonStyle>): ButtonStyle {
    return {
      shape: 'circle',
      size: 'medium',
      textPosition: 'bottom',
      textColor: 'var(--iv-button-circle-medium-text-color)',
      backgroundColor: 'var(--iv-button-circle-medium-bg-color)',
      borderColor: 'var(--iv-button-circle-medium-border-color)',
      transparent: true,
      animation: {
        type: 'ripple',
        duration: 2.5,
        loop: true
      },
      ...config
    };
  }
}

export default StyleUtils;