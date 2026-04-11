import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Yeh line add karein agar components folder bahar hai
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // YEH LINE ADD KAREIN
  ],
};

export default config;