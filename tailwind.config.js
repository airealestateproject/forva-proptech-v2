/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      opacity: {
        8: '0.08',
        16: '0.16',
      },
      colors: {
        // Deep navy / near-black backgrounds
        navy: {
          950: '#050d1a',
          900: '#0a1628',
          850: '#0f1d35',
          800: '#14253f',
          700: '#1b3052',
          600: '#233d68',
        },
        // Electric blue + cyan accents
        accent: {
          50: '#eaf6ff',
          100: '#d0ecff',
          200: '#a3d9ff',
          300: '#66c2ff',
          400: '#2aa6ff',
          500: '#0089f2',
          600: '#006fc4',
          700: '#005a9e',
          800: '#074d82',
          900: '#0b426d',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Silver / metallic neutrals
        silver: {
          100: '#f4f6f9',
          200: '#e6eaf0',
          300: '#cbd3df',
          400: '#a7b3c4',
          500: '#8492a8',
          600: '#6b7891',
          700: '#525e74',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.28)',
        glow: '0 0 0 1px rgba(42,166,255,0.35), 0 8px 32px rgba(0,137,242,0.18)',
      },
      backgroundImage: {
        'navy-radial':
          'radial-gradient(1200px 600px at 20% -10%, rgba(0,137,242,0.18), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(34,211,238,0.12), transparent 55%)',
        'accent-gradient':
          'linear-gradient(135deg, #0089f2 0%, #22d3ee 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-in': 'slide-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
