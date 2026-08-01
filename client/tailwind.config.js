/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#2a5bd7",
          600: "#1f47b3",
          700: "#193a91",
        },
      },
    },
  },
  plugins: [],
};
