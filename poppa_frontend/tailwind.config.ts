import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, welcoming color palette
        cream: {
          50: "#fefcf9",
          100: "#fdf6ed",
          200: "#f9ead8",
          300: "#f3dbbf",
          400: "#e8c49e",
          500: "#daa97a",
          600: "#c98f5e",
          700: "#a6704a",
          800: "#875a3e",
          900: "#6d4935",
        },
        olive: {
          50: "#f7f7f5",
          100: "#edede8",
          200: "#dddbd3",
          300: "#c4c1b4",
          400: "#9f9a89",
          500: "#7a7565",
          600: "#625d50",
          700: "#514d42",
          800: "#454138",
          900: "#3b3831",
        },
        sage: {
          50: "#f5f6f4",
          100: "#e8eae5",
          200: "#d1d5cb",
          300: "#b3baaa",
          400: "#919985",
          500: "#727b66",
          600: "#5a6251",
          700: "#474e42",
          800: "#3b4138",
          900: "#33382f",
        },
        warm: {
          50: "#fefdfb",
          100: "#fdf8f2",
          200: "#faeee0",
          300: "#f5dfc8",
          400: "#edc9a6",
          500: "#e3ae7e",
          600: "#d4905a",
          700: "#b47348",
          800: "#935d3d",
          900: "#784c34",
        },
        terracotta: {
          50: "#fdf7f5",
          100: "#fae9e4",
          200: "#f5d4ca",
          300: "#edb5a4",
          400: "#e08d74",
          500: "#d16a4c",
          600: "#bc5238",
          700: "#9c422e",
          800: "#80382a",
          900: "#6a3127",
        },
        "oai-green": "rgb(16, 163, 127)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "float-fast": "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
