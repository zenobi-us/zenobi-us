import { useContext } from 'react';

import { ScreenLockContext } from './ScreenLockContext';

export function useScreenLock() {
  const context = useContext(ScreenLockContext);
  if (!context) {
    throw new Error(
      'useScreenLock must only be used within children of ScreenLockProvider',
    );
  }

  return context;
}
