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
        // Palette AssureEver — extraite fidèlement de la maquette
        primary: {
          DEFAULT: "#0e7c6b",   // Vert teal principal (boutons, accents)
          light:   "#12a08a",   // Vert teal clair (hover)
          dark:    "#085e51",   // Vert teal foncé (pressed)
        },
        navy: {
          DEFAULT: "#0f2d4a",   // Bleu marine profond (footer, headings)
          light:   "#1a3a5c",   // Bleu marine clair
        },
        surface: {
          DEFAULT: "#f0faf8",   // Fond vert très pâle (hero bg)
          card:    "#ffffff",
        },
        text: {
          primary:   "#0f2d4a",  // Titres
          secondary: "#4a5568",  // Corps de texte
          muted:     "#718096",  // Texte secondaire
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-bg": "url('/images/stage.jpg')",
      },
      boxShadow: {
        card: "0 2px 16px rgba(14, 124, 107, 0.08)",
        "card-hover": "0 8px 32px rgba(14, 124, 107, 0.15)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
