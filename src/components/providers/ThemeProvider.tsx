import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";


export type Theme = 'dark' | 'light'


export interface ThemeContextTypes
{
  currentTheme: Theme;
  toggleTheme: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextTypes>({
  currentTheme: "dark",
  toggleTheme: function (): void
  {
    throw new Error("Function not implemented.");
  }
});


function ThemeProvider({ children }: { children: React.ReactNode })
{
  const [currentTheme, setCurrentTheme] = useState<Theme>(() =>
  {
    const localStorageTheme = localStorage.getItem('tasker-theme') as Theme | null;
    if (localStorageTheme) return localStorageTheme;

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemTheme ? 'dark' : 'light';
  });


  const applyTheme = useCallback((theme: Theme, isManualClick = false) =>
  {
    setCurrentTheme(theme);
    document.body.setAttribute('data-theme', theme);

    if (isManualClick)
    {
      localStorage.setItem('tasker-theme', theme);
    }
  }, [])


  useLayoutEffect(() =>
  {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Handle System Theme Changes (only if no manual preference is set)
  useEffect(() =>
  {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) =>
    {
      if (!localStorage.getItem('tasker-theme'))
      {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => { mediaQuery.removeEventListener('change', handleChange); };
  }, [applyTheme]);


  const toggleTheme = useCallback(() =>
  {
    const updatedTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(updatedTheme, true);
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