/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        accent: '#FF6B6B',
        'accent-green': '#34C759',
        'accent-blue': '#007AFF',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '.SF Pro Text',
          '.SF Pro Display',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      borderRadius: {
        apple: '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
    },
  },
  plugins: [],
}
