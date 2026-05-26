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
        bgPrimary: "#07070a",
        bgSecondary: "#0c0c10",
        surface: "#15151c",
        textPrimary: "#f5f5f7",
        gold: "#d4a857",
        goldSoft: "#f1d292",
      },
      fontFamily: {
        head: ["var(--font-head)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(212, 168, 87, 0.15), transparent 60%)',
      }
    },
  },
  plugins: [],
};
export default config;
