/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#050816',
        'indigo-electric': '#6C63FF',
        'gold-soft': '#F5A623',
        'cool-white': '#E8EAF0',
        'muted-blue': '#1E2A4A',
      },
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

