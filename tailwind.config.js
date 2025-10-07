/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#22C55E", // green
      dark: "#0B0D17",
      lightDark: "#1A1D29",
    },
  },
},

  plugins: [],
};
