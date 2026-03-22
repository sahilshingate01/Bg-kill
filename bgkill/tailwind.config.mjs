/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        bg: "#F5F0E8",
        lime: "#CAFF70",
        purple: "#5C5CFF",
        red: "#FF5C5C",
        black: "#0A0A0A",
      },
    },
  },
  plugins: [],
};
export default config;
