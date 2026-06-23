import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Core surfaces — driven by CSS variables for the Theme Editor.
        ink: "rgb(var(--ink) / <alpha-value>)", // matte black background
        charcoal: "rgb(var(--charcoal) / <alpha-value>)", // #1B1B1B panels
        gunmetal: "rgb(var(--gunmetal) / <alpha-value>)", // gunmetal gray panels
        panel: "rgb(var(--panel) / <alpha-value>)",
        "panel-2": "rgb(var(--panel-2) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)", // thin borders
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        // Accents
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)", // soft light blue
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        caution: "rgb(var(--caution) / <alpha-value>)", // pale yellow warnings
        alert: "rgb(var(--alert) / <alpha-value>)", // minimal red alerts
        success: "rgb(var(--success) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 12px 40px -12px rgb(0 0 0 / 0.7)",
        panel: "0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -16px rgb(0 0 0 / 0.8)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 0 24px -6px rgb(var(--accent) / 0.35)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        scanline: "scanline 6s linear infinite",
        blink: "blink 1.1s step-end infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
