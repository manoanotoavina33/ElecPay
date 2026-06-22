import { createContext, useContext, useState } from 'react';

/* ── Tokens SOMBRE (design actuel conservé tel quel) ── */
export const DARK_T = {
  bg0:         "#07080d",
  bg1:         "#0d0f1a",
  bg2:         "#12152a",
  bg3:         "#1a1f38",
  bg4:         "#222848",
  border:      "rgba(99,120,255,0.12)",
  borderHover: "rgba(99,120,255,0.28)",
  accent:      "#5b6ef5",
  accentGlow:  "rgba(91,110,245,0.35)",
  accentSoft:  "rgba(91,110,245,0.12)",
  text0:       "#f0f2ff",
  text1:       "#9ba3c4",
  text2:       "#5c6380",
  text3:       "#333333",
  success:     "#3ecf8e",
  successSoft: "rgba(62,207,142,0.12)",
  danger:      "#f87171",
  dangerSoft:  "rgba(248,113,113,0.12)",
  warn:        "#fbbf24",
  warnSoft:    "rgba(251,191,36,0.1)",
};

/* ── Tokens CLAIR (nouveau design propre) ── */
export const LIGHT_T = {
  bg0:         "#f0f4ff",
  bg1:         "#ffffff",
  bg2:         "#f8f9ff",
  bg3:         "#eef1ff",
  bg4:         "#e4e9ff",
  border:      "rgba(99,102,241,0.16)",
  borderHover: "rgba(99,102,241,0.32)",
  accent:      "#5b6ef5",
  accentGlow:  "rgba(91,110,245,0.18)",
  accentSoft:  "rgba(91,110,245,0.09)",
  text0:       "#0d0f1a",
  text1:       "#374151",
  text2:       "#6b7280",
  text3:       "#9ca3af",
  success:     "#059669",
  successSoft: "rgba(5,150,105,0.1)",
  danger:      "#dc2626",
  dangerSoft:  "rgba(220,38,38,0.1)",
  warn:        "#d97706",
  warnSoft:    "rgba(217,119,6,0.1)",
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(d => !d);
  const T = isDark ? DARK_T : LIGHT_T;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, T }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
