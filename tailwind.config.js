/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Pastel Palette
        brand: {
          light: '#e0e7ff', // Very light indigo (backgrounds)
          DEFAULT: '#818cf8', // Soft Indigo (buttons/borders)
          dark: '#4f46e5', // Deeper Indigo (text interaction)
        },
        darkbg: '#1e293b', // Slate-800 for dark mode background
      }
    },
  },
  plugins: [],
}