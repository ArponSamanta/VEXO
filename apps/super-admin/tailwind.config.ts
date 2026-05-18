/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vexo: {
          bg: '#0a0a0f',
          'bg-secondary': '#12121a',
          'bg-tertiary': '#1a1a2e',
          'bg-elevated': '#222236',
          blue: '#00d4ff',
          'blue-dark': '#0099cc',
          purple: '#7b2ff7',
          'purple-dark': '#5a1fd4',
          green: '#00ff88',
          pink: '#ff2d78',
          orange: '#ff6b35',
          text: '#ffffff',
          'text-secondary': '#a0a0b8',
          'text-muted': '#6b6b80',
          border: 'rgba(255,255,255,0.1)',
          'border-hover': 'rgba(255,255,255,0.2)',
          glass: 'rgba(255,255,255,0.05)',
          'glass-hover': 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0,212,255,0.3)',
        'glow-purple': '0 0 20px rgba(123,47,247,0.3)',
      },
      backgroundImage: {
        'gradient-vexo': 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
      },
    },
  },
  plugins: [],
};
