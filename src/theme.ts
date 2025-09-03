interface CurrentThemeParams {
  localStorageTheme: string | null;
  systemTheme: MediaQueryList
}
type theme = 'dark' | 'light'

export default function currentThemeStr({ localStorageTheme, systemTheme }: CurrentThemeParams): theme {
  if (localStorageTheme) {
    return localStorageTheme as theme;
  }
  return systemTheme.matches ? 'dark' : 'light';
}

export const systemTheme: MediaQueryList = window.matchMedia('prefers-color-scheme: dark');
export const localStorageTheme: string | null = localStorage.getItem('prj-theme');

export function updateBodyTheme(theme:string){
  document.body.setAttribute('data-theme', theme);
}