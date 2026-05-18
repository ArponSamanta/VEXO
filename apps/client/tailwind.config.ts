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
        'glow-green': '0 0 20px rgba(0,255,136,0.3)',
        'glow-pink': '0 0 20px rgba(255,45,120,0.3)',
        'neon-blue': '0 0 5px rgba(0,212,255,0.4), 0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(0,212,255,0.1)',
        'neon-purple': '0 0 5px rgba(123,47,247,0.4), 0 0 20px rgba(123,47,247,0.2), 0 0 40px rgba(123,47,247,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-vexo': 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
        'gradient-vexo-hover': 'linear-gradient(135deg, #00e5ff, #8c40ff)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
