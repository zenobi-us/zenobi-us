import { createContext } from 'react';

export const ScreenLockContext = createContext<{
  isOpen: boolean;
  stack: string[];
  top: number;
  push: (drawerId: string) => void;
  pop: () => void;
}>({
  isOpen: false,
  stack: [],
  top: 0,
  push: () => {
    return;
  },
  pop: () => {
    return;
  },
});
