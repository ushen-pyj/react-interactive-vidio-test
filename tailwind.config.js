/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 自定义颜色变量
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // 交互式视频播放器颜色
        'iv-button': {
          'bg-primary': 'var(--iv-button-bg-primary)',
          'bg-transparent': 'var(--iv-button-bg-transparent)',
          'text-primary': 'var(--iv-button-text-primary)',
          'border-default': 'var(--iv-button-border-default)',
        },
        // 标题样式颜色
        'iv-title': {
          'default': 'var(--iv-title-default-color)',
          'forest': 'var(--iv-title-forest-color)',
          'village': 'var(--iv-title-village-color)',
          'mystery': 'var(--iv-title-mystery-color)',
          'elegant': 'var(--iv-title-elegant-color)',
        },
        'iv-title-bg': {
          'default': 'var(--iv-title-default-bg-color)',
          'forest': 'var(--iv-title-forest-bg-color)',
          'village': 'var(--iv-title-village-bg-color)',
          'mystery': 'var(--iv-title-mystery-bg-color)',
          'elegant': 'var(--iv-title-elegant-bg-color)',
        },
        // 按钮样式颜色
        'iv-button-text': {
          'circle-large': 'var(--iv-button-circle-large-text-color)',
          'circle-medium': 'var(--iv-button-circle-medium-text-color)',
          'circle-small': 'var(--iv-button-circle-small-text-color)',
          'rectangle': 'var(--iv-button-rectangle-text-color)',
          'transparent': 'var(--iv-button-transparent-text-color)',
        },
        'iv-button-bg': {
          'circle-large': 'var(--iv-button-circle-large-bg-color)',
          'circle-medium': 'var(--iv-button-circle-medium-bg-color)',
          'circle-small': 'var(--iv-button-circle-small-bg-color)',
          'rectangle': 'var(--iv-button-rectangle-bg-color)',
          'transparent': 'var(--iv-button-transparent-bg-color)',
        },
        'iv-button-border': {
          'circle-large': 'var(--iv-button-circle-large-border-color)',
          'circle-medium': 'var(--iv-button-circle-medium-border-color)',
          'circle-small': 'var(--iv-button-circle-small-border-color)',
          'rectangle': 'var(--iv-button-rectangle-border-color)',
          'transparent': 'var(--iv-button-transparent-border-color)',
        }
      },
      // 自定义字体
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      // 自定义关键帧动画
      keyframes: {
        'custom-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)'
          }
        },
        'custom-ripple': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)'
          },
          '70%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)'
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)'
          }
        },
        'custom-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.8'
          }
        },
        'custom-bounce': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0, 0, 0)'
          },
          '40%, 43%': {
            transform: 'translate3d(0, -8px, 0)'
          },
          '70%': {
            transform: 'translate3d(0, -4px, 0)'
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)'
          }
        }
      },
      // 自定义动画
      animation: {
        'custom-glow': 'custom-glow 2s ease-in-out infinite',
        'custom-ripple': 'custom-ripple 1.5s ease-out infinite',
        'custom-pulse': 'custom-pulse 1s ease-in-out infinite',
        'custom-bounce': 'custom-bounce 1s ease-in-out infinite'
      },
      // 扩展变换
      scale: {
        '102': '1.02'
      },
      // 交互式视频播放器尺寸
      spacing: {
        'iv-xs': 'var(--iv-spacing-xs)',
        'iv-sm': 'var(--iv-spacing-sm)',
        'iv-md': 'var(--iv-spacing-md)',
        'iv-lg': 'var(--iv-spacing-lg)',
      },
      // 标题内边距
      padding: {
        'iv-title-default': 'var(--iv-title-default-padding)',
        'iv-title-forest': 'var(--iv-title-forest-padding)',
        'iv-title-village': 'var(--iv-title-village-padding)',
        'iv-title-mystery': 'var(--iv-title-mystery-padding)',
        'iv-title-elegant': 'var(--iv-title-elegant-padding)',
      },
      // 自定义尺寸
      width: {
        'iv-button-sm': 'var(--iv-button-size-small)',
        'iv-button-md': 'var(--iv-button-size-medium)',
        'iv-button-lg': 'var(--iv-button-size-large)',
      },
      height: {
        'iv-button-sm': 'var(--iv-button-size-small)',
        'iv-button-md': 'var(--iv-button-size-medium)',
        'iv-button-lg': 'var(--iv-button-size-large)',
      },
      // 自定义圆角
      borderRadius: {
        'iv-rect': 'var(--iv-button-radius-rect)',
        'iv-circle': 'var(--iv-button-radius-circle)',
        // 标题圆角
        'iv-title-default': 'var(--iv-title-default-border-radius)',
        'iv-title-forest': 'var(--iv-title-forest-border-radius)',
        'iv-title-village': 'var(--iv-title-village-border-radius)',
        'iv-title-mystery': 'var(--iv-title-mystery-border-radius)',
        'iv-title-elegant': 'var(--iv-title-elegant-border-radius)',
      },
      // 自定义字体大小
      fontSize: {
        'iv-default': 'var(--iv-text-size-default)',
        // 标题字体大小
        'iv-title-default': 'var(--iv-title-default-font-size)',
        'iv-title-forest': 'var(--iv-title-forest-font-size)',
        'iv-title-village': 'var(--iv-title-village-font-size)',
        'iv-title-mystery': 'var(--iv-title-mystery-font-size)',
        'iv-title-elegant': 'var(--iv-title-elegant-font-size)',
      },
      // 自定义字体粗细
      fontWeight: {
        'iv-default': 'var(--iv-text-weight-default)',
        // 标题字体粗细
        'iv-title-default': 'var(--iv-title-default-font-weight)',
        'iv-title-forest': 'var(--iv-title-forest-font-weight)',
        'iv-title-village': 'var(--iv-title-village-font-weight)',
        'iv-title-mystery': 'var(--iv-title-mystery-font-weight)',
        'iv-title-elegant': 'var(--iv-title-elegant-font-weight)',
      },
      // 自定义文字阴影
      textShadow: {
        'iv-default': 'var(--iv-text-shadow-default)',
      },
      // 自定义背景模糊
      backdropBlur: {
        'iv-default': 'var(--iv-button-backdrop-blur)',
        // 标题背景模糊
        'iv-title-default': 'var(--iv-title-default-backdrop-blur)',
        'iv-title-forest': 'var(--iv-title-forest-backdrop-blur)',
        'iv-title-village': 'var(--iv-title-village-backdrop-blur)',
        'iv-title-mystery': 'var(--iv-title-mystery-backdrop-blur)',
        'iv-title-elegant': 'var(--iv-title-elegant-backdrop-blur)',
      }
    },
  },
  plugins: [],
};

export default config;