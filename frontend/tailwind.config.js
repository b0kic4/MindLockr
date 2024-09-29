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
          DEFAULT: "hsl(210, 30%, 98%)", // Light background (soft off-white)
          dark: "hsl(210, 10%, 15%)", // Dark background (dark gray, not pure black)
        },
        foreground: {
          DEFAULT: "hsl(210, 15%, 20%)", // Dark foreground for light mode (dark text)
          dark: "hsl(0, 0%, 98%)", // Light foreground for dark mode (light text)
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)", // Light mode card background (pure white)
          dark: "hsl(210, 10%, 20%)", // Dark mode card background (soft dark gray)
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          dark: "hsl(210, 10%, 20%)",
        },
        primary: {
          DEFAULT: "hsl(220, 90%, 56%)", // Blue for primary actions
          dark: "hsl(220, 90%, 75%)", // Lighter primary blue for dark mode
        },
        secondary: {
          DEFAULT: "hsl(190, 45%, 85%)", // Light secondary color (teal)
          dark: "hsl(190, 45%, 25%)", // Dark mode secondary color (darker teal)
        },
        muted: {
          DEFAULT: "hsl(210, 30%, 97%)", // Muted background for light mode
          dark: "hsl(210, 20%, 20%)", // Muted background for dark mode
        },
        border: {
          DEFAULT: "hsl(210, 10%, 80%)", // Light gray border for light mode
          dark: "hsl(210, 20%, 30%)", // Darker border for dark mode
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
