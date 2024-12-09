import { useCallback, useContext } from 'react';

import { NavigationContext } from './NavigationProvider';

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export function useCurrentPath(currentPath?: string) {
  const isCurrent = useCallback(
    (path: string) => {
      return currentPath === path;
    },
    [currentPath],
  );

  const isAncestor = useCallback(
    (path: string) => {
      if (!currentPath) {
        return false;
      }

      return currentPath.startsWith(path);
    },
    [currentPath],
  );

  return {
    currentPath,
    isCurrent,
    isAncestor,
  };
}
