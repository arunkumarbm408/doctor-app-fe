/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false, // Disable Tailwind reset — Bootstrap already handles this
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
