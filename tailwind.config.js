/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // This ensures that Tailwind CSS applies to your app directory
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        netflixRed: '#E50914',
        netflixGray: '#141414',
      },
    },
  },
  plugins: [],
}