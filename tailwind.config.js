/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#4CAF50",
          orange: "#FF9800",
          blue: "#2196F3",
          bg: "#F5F0E5",
          text: "#333333",
          gray: "#666666"
        }
      },
      fontFamily: {
        heading: ["Inter", "ui-sans-serif", "system-ui", "Arial", "sans-serif"],
        sans: ["Open Sans", "ui-sans-serif", "system-ui", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
};