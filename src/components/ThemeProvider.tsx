import { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";
import currentThemeStr, { localStorageTheme, systemTheme, updateBodyTheme } from "../theme";

interface ThemeContextTypes {
  theme: 'dark' | 'light'
  handleThemeToggle: () => void
}
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextTypes>({
  theme: "dark",
  handleThemeToggle: function (): void {
    throw new Error("Function not implemented.");
  }
});


function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => currentThemeStr({ localStorageTheme, systemTheme }))

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, []);


  const memorizedData = useMemo(() => {
    return { theme, handleThemeToggle }
  }, [handleThemeToggle, theme]);

  useEffect(() => {
    localStorage.setItem('prj-theme', theme);
    updateBodyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext value={memorizedData}>
      {children}
    </ThemeContext>
  )
}

export default memo(ThemeProvider);