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
      }
    },
  },
  plugins: [],
};

export default config;