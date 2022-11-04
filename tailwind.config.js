/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dimmed: "var(--dimmed)",
      },
      fontSize: {
        "2xs": "0.6rem",
      },
      animation: {
        zoom: "zoom 0.3s",
      },
      keyframes: {
        zoom: {
          '0%': {transform: "scale(0.5)"},
        }
      },
    },
  },
  plugins: [],
  important: "#root",
};
