import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B1712",
          soft: "#2A231A",
          muted: "#5C5142",
          faint: "#8A7D6A",
        },
        paper: {
          DEFAULT: "#F7F2E8",
          warm: "#EFE6D3",
          card: "#FBF7EF",
          deep: "#E6DBC3",
        },
        burgundy: {
          DEFAULT: "#7A1B2B",
          deep: "#5C1220",
          darker: "#43101B",
          wine: "#8F2C3C",
          soft: "#A54A58",
        },
        gold: {
          DEFAULT: "#B8892B",
          soft: "#C9A757",
          deep: "#97701D",
          pale: "#E4D3A8",
        },
        night: "#15120E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,23,18,.06), 0 8px 24px rgba(27,23,18,.08)",
        lift: "0 2px 4px rgba(27,23,18,.08), 0 18px 40px rgba(27,23,18,.14)",
        glow: "0 0 0 1px rgba(184,137,43,.35), 0 8px 28px rgba(122,27,43,.18)",
      },
      letterSpacing: {
        snug: "-0.01em",
        tightest: "-0.03em",
      },
      maxWidth: {
        content: "1220px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(.6)" },
          "70%": { transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "line-draw": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .5s ease both",
        "scale-in": "scale-in .35s cubic-bezier(.22,1,.36,1) both",
        "pop-in": "pop-in .45s cubic-bezier(.22,1,.36,1) both",
        "line-draw": "line-draw 1s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.5s infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.22,1,.36,1)",
        soft: "cubic-bezier(.4,0,.2,1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;