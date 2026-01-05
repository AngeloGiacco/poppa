/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        poppa: {
          brown: "#8B4513",
          "brown-light": "#A0522D",
          "brown-dark": "#654321",
          cream: "#FFF8DC",
          beige: "#F5DEB3",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
