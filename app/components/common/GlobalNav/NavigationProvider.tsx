import type { PropsWithChildren } from 'react';
import { createContext } from 'react';

type Navigation = {
  currentPath?: string;
};

export const NavigationContext = createContext<Navigation>({});

export function NavigationProvider({
  children,
  currentPath,
}: PropsWithChildren<{ currentPath: string }>) {
  return (
    <NavigationContext.Provider
      value={{
        currentPath,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
