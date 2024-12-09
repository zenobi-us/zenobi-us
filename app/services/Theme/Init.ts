import { useEffect, useState } from 'react';

type ThemeName = 'light' | 'dark';
/**
 * A module that switches the theme based on the user's system preferences.
 * @param {'light' | 'dark'} mode The theme to switch to.
 */
function setPreferredTheme(mode: ThemeName) {
  const root = document.documentElement;

  if (mode === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

function conditionalCallback<T extends (...args: unknown[]) => unknown>(
  callback?: T,
  ...args: Parameters<T>
) {
  if (typeof callback !== 'function') {
    return;
  }
  callback(args);
}

export function InitialiseColorScheme(onDone?: (theme: ThemeName) => void) {
  if (typeof window === 'undefined') {
    return;
  }

  const watcher = window.matchMedia(`(prefers-color-scheme: dark)`);
  const initialTheme = watcher.matches ? 'dark' : 'light';
  setPreferredTheme(initialTheme);
  conditionalCallback(onDone, initialTheme);

  const handleThemeChange = (event: MediaQueryListEvent) => {
    const theme = event.matches ? 'dark' : 'light';
    setPreferredTheme(theme);
    conditionalCallback(onDone, theme);
  };
  watcher.addEventListener('change', handleThemeChange);

  return () => {
    watcher.removeEventListener('change', handleThemeChange);
  };
}

export function useDarkMode(
  onDone: Parameters<typeof InitialiseColorScheme>[0]
) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return InitialiseColorScheme((theme) => {
      setLoading(false);
      onDone(theme);
    });
    // initial run only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
  };
}
