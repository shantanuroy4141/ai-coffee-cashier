import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        greek: {
          50: "#f8f5f0",
          100: "#ede6dc",
          200: "#ddd0c2",
          300: "#c4b5a0",
          400: "#a89276",
          500: "#8b7355",
          600: "#6f5d47",
          700: "#5a4a3a",
          800: "#4a3d32",
          900: "#3d342b",
        },
        santorini: {
          50: "#e8f4fc",
          100: "#cce6f7",
          200: "#9cccef",
          300: "#66b0e6",
          400: "#3a96db",
          500: "#1e7bc4",
          600: "#1765a8",
          700: "#14518a",
          800: "#154470",
          900: "#0f2f4d",
        },
        sand: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
        },
        cream: "#faf8f5",
        espresso: "#3e2723",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
