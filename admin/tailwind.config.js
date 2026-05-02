/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        bounce3: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        fadeSlideIn: {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite',
        bounce1: 'bounce3 1.4s ease-in-out 0s infinite',
        bounce2: 'bounce3 1.4s ease-in-out 0.16s infinite',
        bounce3: 'bounce3 1.4s ease-in-out 0.32s infinite',
        fadeSlideIn: 'fadeSlideIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
