export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        primaryLight: "#2A2A2A", // Darker light variant
        grayText: "#9CA3AF",
        // Emma Bot Colors - Premium Palette
        "emma-background": "hsl(var(--emma-background))",
        "emma-foreground": "hsl(var(--emma-foreground))",
        "emma-card": "hsl(var(--emma-card))",
        "emma-card-foreground": "hsl(var(--emma-card-foreground))",
        "emma-popover": "hsl(var(--emma-popover))",
        "emma-popover-foreground": "hsl(var(--emma-popover-foreground))",
        "emma-primary": "#D4AF37", // Elegant Gold
        "emma-primary-foreground": "#000000",
        "emma-secondary": "#1E293B", // Slate 800
        "emma-secondary-foreground": "#F8FAFC",
        "emma-muted": "#334155",
        "emma-muted-foreground": "#94A3B8",
        "emma-accent": "#1E293B",
        "emma-accent-foreground": "#F8FAFC",
        "emma-destructive": "#991B1B", // Dark Red
        "emma-destructive-foreground": "#ffffff",
        "emma-border": "#334155",
        "emma-input": "#334155",
        "emma-ring": "#D4AF37", // Gold ring
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "road-rage": ["Road Rage", "cursive"],
      },
    },
  },
  plugins: [],
};