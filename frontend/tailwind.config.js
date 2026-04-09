/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e14',
        surface: '#0e141c',
        surfaceLight: '#1a2637',
        primary: '#bac7dd',
        accent: '#6bfe9c',
        danger: '#ee7d77',
        outline: '#3c495b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
