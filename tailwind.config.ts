// Tailwind CSS 配置文件 — 高端视觉设计系统
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Premium neutral palette
        surface: {
          DEFAULT: '#fafafa',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Brand — rich indigo/violet gradient core
        brand: {
          50: '#f3f0ff',
          100: '#e8e2ff',
          200: '#d4caff',
          300: '#b4a6ff',
          400: '#8f75ff',
          500: '#6d4fff',
          600: '#5b34f0',
          700: '#4c27d6',
          800: '#3f22ac',
          900: '#361e8a',
          950: '#20115e',
        },
        // Accent — warm amber for highlights
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        success: {
          50: '#f0fdf6',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],
        '5xl': ['3.25rem', { lineHeight: '3.75rem', letterSpacing: '-0.03em' }],
        '6xl': ['4rem', { lineHeight: '4.5rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'sm': '0.5rem',
        'card': '1.25rem',
        'card-lg': '2rem',
        'card-xl': '2.5rem',
        'button': '9999px',
        'input': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        // Premium multi-layer diffused shadows
        'sm': '0 1px 2px 0 rgba(0,0,0,0.03)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02), 0 12px 24px rgba(0,0,0,0.03)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.03), 0 20px 40px rgba(0,0,0,0.06)',
        'card-active': '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.01), 0 8px 16px rgba(0,0,0,0.04)',
        'modal': '0 0 0 1px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.04), 0 32px 64px rgba(0,0,0,0.08)',
        'glow-brand': '0 0 40px rgba(109,79,255,0.12), 0 0 80px rgba(109,79,255,0.06)',
        'glow-accent': '0 0 40px rgba(245,158,11,0.12), 0 0 80px rgba(245,158,11,0.06)',
        'inner-highlight': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'inner-glow': 'inset 0 1px 1px rgba(255,255,255,0.15)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'premium-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'fade-blur-in': {
          '0%': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'breath': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.8' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-blur-in': 'fade-blur-in 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-down': 'fade-down 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-right': 'slide-right 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'breath': 'breath 4s ease-in-out infinite',
        'orb-float': 'orb-float 20s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
