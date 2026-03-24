/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        cream: '#F6F6F2',
        navy: '#0B1E4A',
        accent: '#D93A3A',
        'accent-blue': '#2E5AAC',
        ink: '#111111',
        muted: '#6B6F76',
      },
      borderRadius: {
        card: '28px',
        stamp: '9999px',
      },
      boxShadow: {
        card: '0 18px 40px rgba(0,0,0,0.08)',
        stamp: '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
