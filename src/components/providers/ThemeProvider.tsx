import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";


type Theme = 'dark' | 'light'


interface ThemeContextTypes {
  currentTheme: Theme;
  toggleTheme: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextTypes>({
  currentTheme: "dark",
  toggleTheme: function (): void {
    throw new Error("Function not implemented.");
  }
});


function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const localStorageTheme = localStorage.getItem('prj-theme') as Theme | null;
    if (localStorageTheme) return localStorageTheme;

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemTheme ? 'dark' : 'light';
  });
  
  
  const applyTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('prj-theme', theme);
  }, [])
  
  
  useLayoutEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);
  // Handle System Theme Changes (only if no manual preference is set)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('prj-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => { mediaQuery.removeEventListener('change', handleChange); };
  }, [applyTheme]);


  const toggleTheme = useCallback(() => {
    const updatedTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(updatedTheme);
  }, [currentTheme, applyTheme])


  const memorizedData = useMemo(() => ({
    currentTheme,
    toggleTheme
  }), [currentTheme, toggleTheme]);


  return (
    <ThemeContext value={memorizedData}>
      {children}
    </ThemeContext>
  )
}

export default ThemeProvider;