/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta primaria — Azul profesional
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Color principal
          900: '#1e3a8a',
          950: '#172554',
        },
        // Acento — Sky para métodos de pago y badges
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Éxito
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        // Superficie
        surface: '#ffffff',
      },
      fontFamily: {
        sans:   ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -4px rgba(37, 99, 235, 0.35)',
        'glow-green': '0 0 20px -4px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'pulse-once': 'pulseOnce 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOnce: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
    darkTheme: "light",
  },
};
