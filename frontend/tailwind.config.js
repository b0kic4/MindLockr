export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        background: {
          DEFAULT: "hsl(210, 30%, 98%)",
          dark: "#0E1113", // Updated dark background color
        },
        foreground: {
          DEFAULT: "hsl(210, 15%, 20%)",
          dark: "hsl(0, 0%, 98%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          dark: "hsl(210, 10%, 20%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          dark: "hsl(210, 10%, 20%)",
        },
        primary: {
          DEFAULT: "hsl(220, 90%, 56%)",
          dark: "hsl(220, 90%, 75%)",
        },
        secondary: {
          DEFAULT: "hsl(190, 45%, 85%)",
          dark: "hsl(190, 45%, 25%)",
        },
        muted: {
          DEFAULT: "hsl(210, 30%, 97%)",
          dark: "hsl(210, 20%, 20%)",
        },
        border: {
          DEFAULT: "hsl(210, 10%, 80%)",
          dark: "hsl(210, 20%, 30%)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
