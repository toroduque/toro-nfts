/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d9e2",
          300: "#aeb7c8",
          400: "#8190a8",
          500: "#60708c",
          600: "#4c5a73",
          700: "#3f4a5e",
          800: "#373f50",
          900: "#0f1623",
          950: "#080c14",
        },
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a6ff",
          500: "#3385fc",
          600: "#1d66f1",
          700: "#1650dd",
          800: "#1842b3",
          900: "#1a3b8d",
        },
      },
      fontfamily: {},
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
