import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { lightColors, darkColors } from "../theme";

export const THEME_KEY = "theme";

const ThemeContext = createContext(null);


export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Cargamos la preferencia guardada al inciar la app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved) setIsDark(saved === "dark");
      } catch (e) {
        console.warn("No se pudo leer el tema:", e);
      } finally {
        setThemeLoaded(true);
      }
    })();
  }, []);

  // Alternar tema y persistirlo
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch (e) {
      console.warn("No se pudo guardar el tema:", e);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.bg,
        card: colors.card,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [isDark, colors]);

  const value = useMemo(
    () => ({ isDark, colors, toggleTheme, navTheme, themeLoaded }),
    [isDark, colors, themeLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}