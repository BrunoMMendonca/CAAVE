/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ebac6',
        secondary: '#b6509e',
        darkBlue: '#1b2034',
        darkerBlue: '#131726',
        lightText: '#f1f1f3',
        mediumText: '#a5a8b6',
        accentTeal: '#4ECDC4',
        cardano: '#0033AD',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.1)',
        hover: '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2ebac6 0%, #b6509e 100%)',
      },
    },
  },
  plugins: [],
}
