/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["\"IBM Plex Sans\"", "ui-sans-serif", "system-ui"],
        display: ["\"Space Grotesk\"", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          50: "#f6f6f6",
          100: "#ececec",
          200: "#d6d6d6",
          300: "#bdbdbd",
          400: "#9b9b9b",
          500: "#7a7a7a",
          600: "#5c5c5c",
          700: "#444444",
          800: "#2c2c2c",
          900: "#161616",
        },
        mint: {
          50: "#edfdf8",
          100: "#d7f8ef",
          200: "#a9eddc",
          300: "#72e0c6",
          400: "#3fd3b0",
          500: "#20b894",
          600: "#179375",
          700: "#11705b",
          800: "#0e5747",
          900: "#0c4538",
        },
        clay: {
          50: "#f7f2ed",
          100: "#efe5da",
          200: "#dcc8b4",
          300: "#c7a88c",
          400: "#b38c6a",
          500: "#9a7453",
          600: "#7b5b40",
          700: "#5f4632",
          800: "#443325",
          900: "#2e2218",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -18px rgba(0,0,0,0.45)",
        edge: "0 0 0 1px rgba(17,17,17,0.08)",
      },
    },
  },
  plugins: [],
};
