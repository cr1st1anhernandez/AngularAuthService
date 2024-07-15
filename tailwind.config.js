const { cupcake } = require("daisyui/src/theming/themes");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#f0f0f0",
          error: "#e11d48",
        },
      },
    ],
  },
};
