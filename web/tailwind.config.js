import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1100px" },
    },
    extend: {
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["'Hanken Grotesk'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Per-module accent hues
        tasks: "hsl(var(--tasks))",
        notes: "hsl(var(--notes))",
        finance: "hsl(var(--finance))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(24 20% 12% / 0.04), 0 8px 24px -12px hsl(24 20% 12% / 0.12)",
        lift: "0 2px 6px hsl(24 20% 12% / 0.06), 0 18px 40px -18px hsl(24 20% 12% / 0.22)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "chime": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(12deg)" },
          "40%": { transform: "rotate(-9deg)" },
          "60%": { transform: "rotate(5deg)" },
          "80%": { transform: "rotate(-3deg)" },
        },
      },
      animation: {
        rise: "rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        chime: "chime 0.9s ease-in-out",
      },
    },
  },
  plugins: [animate],
}
