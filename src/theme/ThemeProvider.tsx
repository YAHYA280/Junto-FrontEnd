import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';

interface ThemeColors {
  primary: string;
  text: string;
  background: string;
  // Add more as needed
}

interface ThemeContextType {
  dark: boolean;
  colors: ThemeColors;
  setScheme: (scheme: 'light' | 'dark') => void;
}

const lightColors: ThemeColors = {
  primary: colors.primary,
  text: colors.dark1,
  background: colors.white,
};

const darkColors: ThemeColors = {
  primary: colors.primary,
  text: colors.white,
  background: colors.dark1,
};

const defaultThemeContext: ThemeContextType = {
  dark: false,
  colors: lightColors,
  setScheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const defaultTheme: ThemeContextType = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
    setScheme: (scheme: 'light' | 'dark') => setIsDark(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
