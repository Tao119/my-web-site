import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Neobrutalism Color Palette
      colors: {
        // Primary Navy Blue Theme
        navy: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Neobrutalism Accent Colors
        neon: {
          yellow: '#fbbf24',
          pink: '#ec4899',
          lime: '#84cc16',
          orange: '#f97316',
        },
        // Dark Mode Colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
        },
      },
      // Neobrutalism Typography
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      // Neobrutalism Shadows
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-md': '6px 6px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
        'neo-2xl': '16px 16px 0px 0px rgba(0,0,0,1)',
        // Colored shadows
        'neo-yellow': '4px 4px 0px 0px #fbbf24',
        'neo-pink': '4px 4px 0px 0px #ec4899',
        'neo-lime': '4px 4px 0px 0px #84cc16',
        'neo-orange': '4px 4px 0px 0px #f97316',
        'neo-navy': '4px 4px 0px 0px #1e3a8a',
      },
      // Responsive Breakpoints (Enhanced)
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      // Animation and Transitions
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'shadow-pulse': 'shadowPulse 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
      },
      keyframes: {
        shadowPulse: {
          '0%, 100%': { boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' },
          '50%': { boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
      },
      // Spacing for Neobrutalism
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Border Radius (Minimal for Neobrutalism)
      borderRadius: {
        'neo': '0px', // Sharp corners for neobrutalism
        'neo-sm': '2px',
        'neo-md': '4px',
      },
      // Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neo-gradient': 'linear-gradient(135deg, #fbbf24 0%, #ec4899 50%, #84cc16 100%)',
      },
    },
  },
  plugins: [],
}
export default config
