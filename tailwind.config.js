/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        'criforge': {
          'bg': '#0b0b0b',
          'bg-secondary': '#1a1a1a', 
          'bg-card': '#262626',
          'fg': '#ffffff',
          'fg-secondary': '#cccccc',
          'fg-muted': '#999999',
          'accent': '#e50914',
          'accent-dark': '#b8070f',
          'accent-light': '#ff1e2d',
          'accent-glow': '#e50914',
          'gray': '#2a2a2a',
          'gray-light': '#404040',
          'gray-dark': '#1a1a1a',
        },
        'inferno': {
          'bg': '#0b0b0b',
          'bg-secondary': '#1a1a1a',
          'bg-card': '#262626',
          'fg': '#ffffff',
          'fg-secondary': '#cccccc',
          'fg-muted': '#999999',
          'accent': '#e50914',
          'accent-dark': '#b8070f',
          'accent-light': '#ff1e2d',
          'accent-glow': '#e50914',
          'gray': '#2a2a2a',
          'gray-light': '#404040',
          'gray-dark': '#1a1a1a',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'arrow-flow': 'arrow-flow 2s ease-in-out infinite',
        'gothic-pulse': 'gothic-pulse 4s ease-in-out infinite',
        'arrow-glow': 'arrow-glow 3s ease-in-out infinite',
        'elongated-pulse': 'elongated-pulse 3s ease-in-out infinite',
        'arrow-head-glow': 'arrow-head-glow 2s ease-in-out infinite',
        'arrow-glow-wave': 'arrow-glow-wave 4s ease-in-out infinite',
        'marquee': 'marquee var(--duration) linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 0, 0, 0.8)',
            opacity: '0.8'
          },
        },
        'arrow-flow': {
          '0%': { transform: 'translateX(-10px)', opacity: '0.5' },
          '50%': { transform: 'translateX(0px)', opacity: '1' },
          '100%': { transform: 'translateX(10px)', opacity: '0.5' },
        },
        'gothic-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 0, 0, 0.1)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 35px rgba(255, 0, 0, 0.6), inset 0 0 30px rgba(255, 0, 0, 0.2)',
            opacity: '0.9'
          },
        },
        'arrow-glow': {
          '0%, 100%': { 
            textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
            opacity: '1'
          },
          '50%': { 
            textShadow: '0 0 15px #ff3333, 0 0 30px #ff3333, 0 0 45px #ff3333',
            opacity: '0.8'
          },
        },
        'elongated-pulse': {
          '0%, 100%': { 
            opacity: '0.7',
            transform: 'scaleX(0.9)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scaleX(1.1)'
          },
        },
        'arrow-head-glow': {
          '0%, 100%': { 
            textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
            transform: 'scale(1)'
          },
          '50%': { 
            textShadow: '0 0 20px #ff3333, 0 0 30px #ff3333',
            transform: 'scale(1.1)'
          },
        },
        'arrow-glow-wave': {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scaleX(0.8)'
          },
          '50%': { 
            opacity: '0.6',
            transform: 'scaleX(1.2)'
          },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        }
      },
      perspective: {
        '1000': '1000px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
