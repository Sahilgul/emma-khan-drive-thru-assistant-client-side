import React, { createContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const setPrimaryColor = (color: string) => {
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("primaryColor", color);
  };

  const setSecondaryColor = (color: string) => {
    document.documentElement.style.setProperty("--secondary-color", color);
    localStorage.setItem("secondaryColor", color);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedPrimary = localStorage.getItem("primaryColor");
    const savedSecondary = localStorage.getItem("secondaryColor");
    if (savedPrimary) document.documentElement.style.setProperty("--primary-color", savedPrimary);
    if (savedSecondary) document.documentElement.style.setProperty("--secondary-color", savedSecondary);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setPrimaryColor, setSecondaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
