import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-family)", "system-ui", "sans-serif"],
      },
      colors: {
        background: {
          DEFAULT: "var(--background, var(--background-10))",
          10: "var(--background-10)",
          20: "var(--background-20)",
        },
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-primary": "var(--primary)",
        "primary-container": "var(--primary-container)",
        "surface-disabled": "var(--surface-disabled)",
        border: {
          DEFAULT: "var(--border, var(--border-20))",
          strong: "var(--border-strong)",
        },
        "border-10": "var(--border-10)",
        "border-20": "var(--border-20)",
        "border-30": "var(--border-30)",
        ring: "var(--ring)",
        surface: {
          10: "var(--surface-10)",
          20: "var(--surface-20)",
        },
        "on-surface": {
          10: "var(--on-surface-10)",
          20: "var(--on-surface-20)",
          30: "var(--on-surface-30)",
        },
        "on-surface-disabled": "var(--on-surface-disabled)",
      },
      borderRadius: {
        sm: "var(--radius-4)",
        DEFAULT: "var(--radius-6)",
        md: "var(--radius-12)",
      },
    },
  },
  plugins: [],
};

export default config;
