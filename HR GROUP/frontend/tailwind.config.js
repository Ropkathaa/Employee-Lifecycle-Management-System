/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          hover: 'hsl(var(--color-primary-hover) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'hsl(var(--color-danger) / <alpha-value>)',
        },
        background: {
          DEFAULT: 'hsl(var(--color-background) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'hsl(var(--color-surface) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'hsl(var(--color-border) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '72px': '72px',
      },
    },
  },
  plugins: [],
}
