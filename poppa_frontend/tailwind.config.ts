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
        // Phosphor-inspired color palette
        cream: {
          50: "#faf8f5",
          100: "#f3ebe2",
          200: "#e8ddd0",
          300: "#d9c8b4",
          400: "#c5ab93",
          500: "#b5947a",
          600: "#a8826c",
          700: "#8c6a5a",
          800: "#73584c",
          900: "#5f4940",
        },
        olive: {
          50: "#f4f6f3",
          100: "#e5eae3",
          200: "#ccd5c8",
          300: "#a8b9a1",
          400: "#7f9876",
          500: "#5c6b55",
          600: "#4a5745",
          700: "#3d4a38",
          800: "#333d2f",
          900: "#2b3328",
        },
        sage: {
          50: "#f6f7f4",
          100: "#e9ece5",
          200: "#d4d9cc",
          300: "#b7c0aa",
          400: "#96a284",
          500: "#78876a",
          600: "#5e6b53",
          700: "#4a5543",
          800: "#3d4638",
          900: "#343b30",
        },
        warm: {
          50: "#fdfcfa",
          100: "#f9f5f0",
          200: "#f2e9de",
          300: "#e8d6c4",
          400: "#dcbea3",
          500: "#cfa585",
          600: "#bd886a",
          700: "#9d6d57",
          800: "#805a4a",
          900: "#694b3e",
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
