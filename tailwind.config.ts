import type { Config } from "tailwindcss";

/**
 * Design tokens for the Fleuraya demo.
 * Palette: porcelain neutrals + deep wine accent + blush tints (boutique florist, not marketplace).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        porcelain: "#FBFAF7",
        sand: "#F2ECE4",
        ink: { DEFAULT: "#2B2126", soft: "#5C4E55", mute: "#8E7F86" },
        wine: {
          DEFAULT: "#6D2436",
          deep: "#511A28",
          soft: "#8C3A4E",
        },
        blush: { DEFAULT: "#F4E4E7", deep: "#E9CDD3" },
        sage: "#7E8E72",
        line: "#E7DFD8",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Tajawal", "system-ui", "sans-serif"],
      },
      spacing: { "4.5": "1.125rem", "13": "3.25rem" },
      borderRadius: { xl2: "1.25rem", arch: "999px 999px 1.25rem 1.25rem" },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(43,33,38,0.14)",
        lift: "0 16px 44px -16px rgba(43,33,38,0.22)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { fadeUp: "fadeUp .5s ease both" },
    },
  },
  plugins: [],
};
export default config;
