/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        // Warm paper-and-ink editorial palette.
        ink: {
          50: "#FAF8F2",
          100: "#F1EDE3",
          200: "#E4DECF",
          300: "#CDC5B0",
          400: "#A29A83",
          500: "#7B735F",
          600: "#5C5645",
          700: "#474336",
          800: "#2F2C22",
          900: "#1C1A13",
          950: "#100F0A",
        },
        // Vermilion accent.
        brand: {
          50: "#FDF1EC",
          100: "#FBDED2",
          200: "#F6BCA6",
          300: "#EF9272",
          400: "#E76B47",
          500: "#DB4526",
          600: "#C5371B",
          700: "#A32C16",
          800: "#822414",
          900: "#6A2013",
        },
        paper: "#FAF8F2",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,26,19,0.04), 0 8px 24px -12px rgba(28,26,19,0.12)",
        lift: "0 2px 4px rgba(28,26,19,0.05), 0 18px 40px -18px rgba(28,26,19,0.22)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "draw-line": "draw-line 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
