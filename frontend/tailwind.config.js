/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#090d16',       // Deep cosmic dark background
          card: 'rgba(17, 24, 39, 0.7)', // Semi-transparent card color
          primary: '#6366f1',  // Indigo accent
          secondary: '#a855f7',// Purple accent
          success: '#10b981',  // Emerald Green
          warning: '#f59e0b',  // Amber yellow
          danger: '#ef4444',   // Rose red
          text: '#f3f4f6',     // Off-white primary text
          muted: '#9ca3af'     // Gray secondary text
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
