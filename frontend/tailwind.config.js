/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0C4B33', // Matching Django brand color from README
          light: '#156b4a',
          dark: '#063022',
        },
        secondary: {
          DEFAULT: '#FDB813', // University/Student gold vibe
          light: '#ffc847',
          dark: '#c99100',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
