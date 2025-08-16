import React, { createContext, useContext, ReactNode } from 'react';
import { modernTheme, Theme } from '../../styles/theme';

interface ThemeContextType {
  theme: Theme;
  colors: Theme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  shadows: Theme['shadows'];
  animations: Theme['animations'];
  borderRadius: Theme['borderRadius'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ModernThemeProvider({ children }: ThemeProviderProps) {
  const value: ThemeContextType = {
    theme: modernTheme,
    colors: modernTheme.colors,
    typography: modernTheme.typography,
    spacing: modernTheme.spacing,
    shadows: modernTheme.shadows,
    animations: modernTheme.animations,
    borderRadius: modernTheme.borderRadius,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useModernTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useModernTheme must be used within a ModernThemeProvider');
  }
  return context;
}