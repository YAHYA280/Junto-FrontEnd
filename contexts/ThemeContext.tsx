import { StatusBar } from "expo-status-bar";
import React, { createContext, ReactNode, useContext } from "react";
import { useThemeColors } from "../hooks/useTheme";
import { useThemeStore } from "../store/themeStore";

interface ThemeContextType {
  colors: ReturnType<typeof useThemeColors>;
  isDark: boolean;
  themeMode: "light" | "dark" | "system";
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const colors = useThemeColors();
  const { themeMode, toggleTheme, setThemeMode } = useThemeStore();

  return (
    <ThemeContext.Provider value={{
      colors,
      isDark: colors.isDark,
      themeMode,
      toggleTheme,
      setThemeMode
    }}>
      <StatusBar style={colors.isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
