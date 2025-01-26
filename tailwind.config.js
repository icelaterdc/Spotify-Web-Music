/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lyra: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0f3460',
          highlight: '#0077ff',
          text: '#e2e8f0',
          'text-dim': '#94a3b8'
        }
      }
    },
  },
  plugins: [],
};