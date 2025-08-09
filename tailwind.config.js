module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-green': '#059669',
        'brand-orange': '#ea580c',
        'brand-bg': '#f9fafb',
        'brand-text': '#111827',
        'brand-gray': '#6b7280',
      },
    },
  },
  plugins: [],
};
