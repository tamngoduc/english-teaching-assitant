import { useContext, useState } from "react";

import { STORAGE_KEYS, THEME_VALUES } from "src/constant";
import { ThemeContext } from "src/contexts/ThemeContext";

export const useTheme = () => useContext(ThemeContext);

export const usePersistedTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    const newThemeMode = !isDarkMode;
    setIsDarkMode(newThemeMode);
    localStorage.setItem(
      STORAGE_KEYS.THEME,
      newThemeMode ? THEME_VALUES.DARK : THEME_VALUES.LIGHT
    );
  };
  const loadThemeState = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === THEME_VALUES.DARK) {
      setIsDarkMode(true);
    }
  };
  return {
    isDarkMode,
    toggleTheme,
    loadThemeState,
  };
};
