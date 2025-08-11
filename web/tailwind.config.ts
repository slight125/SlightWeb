import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f8ff',
          100: '#cfe8ff',
          200: '#9fd1ff',
          300: '#6fb9ff',
          400: '#3fa2ff',
          500: '#1689ff',
          600: '#0f6fd6',
          700: '#0c58aa',
          800: '#09407e',
          900: '#062952'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
