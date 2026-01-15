export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        primaryLight: "#EEF2FF", // Very light indigo
        grayText: "#64748B",
        // Emma Bot Colors - Modern Premium
        "emma-background": "hsl(var(--emma-background))",
        "emma-foreground": "hsl(var(--emma-foreground))",
        "emma-card": "hsl(var(--emma-card))",
        "emma-card-foreground": "hsl(var(--emma-card-foreground))",
        "emma-popover": "hsl(var(--emma-popover))",
        "emma-popover-foreground": "hsl(var(--emma-popover-foreground))",
        "emma-primary": "#6366F1", // Indigo 500
        "emma-primary-foreground": "#ffffff",
        "emma-secondary": "#1E293B", // Slate 800
        "emma-secondary-foreground": "#F8FAFC",
        "emma-muted": "#334155",
        "emma-muted-foreground": "#94A3B8",
        "emma-accent": "#1E293B",
        "emma-accent-foreground": "#F8FAFC",
        "emma-destructive": "#EF4444",
        "emma-destructive-foreground": "#ffffff",
        "emma-border": "#334155",
        "emma-input": "#334155",
        "emma-ring": "#6366F1",
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