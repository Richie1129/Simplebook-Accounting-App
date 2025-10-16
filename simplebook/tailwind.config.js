/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        income: {
          light: '#22c55e',  // green-600
          dark: '#4ade80',   // green-400
        },
        expense: {
          light: '#dc2626',  // red-600
          dark: '#f87171',   // red-400
        },
      },
    },
  },
  plugins: [],
}
