import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useKeyboardEvent } from '@react-hookz/web';

import { ScreenLockContext } from './ScreenLockContext';
import type { ScreenLockStack } from './types';
import { ScreenLockEvents } from './ScreenLockEvents';

export function ScreenLockProvider({ children }: PropsWithChildren<object>) {
  const [stack, setStack] = useState<ScreenLockStack>([]);
  const [top, setTop] = useState(0);
  const isOpen = !!stack && stack.length > 0;

  const handlePop = () => {
    setStack((stack) => {
      const id = stack.shift();
      if (id) {
        ScreenLockEvents.emit('popped', { id });
      }
      return stack;
    });
  };

  const handlePush = (id: string) => {
    if (stack.includes(id)) {
      return;
    }
    setStack((stack) => {
      const newStack = [id, ...(stack || [])];
      return newStack;
    });
    ScreenLockEvents.emit('pushed', { id });
  };

  useEffect(
    function DetectAndScrollToPosition() {
      /**
       * if we're opening then we need to preserve the
       * scroll position
       */
      if (isOpen) {
        const scrollTop = window.scrollY;
        document.body.style.top = `-${scrollTop}px`;
        setTop(scrollTop);
      }

      /**
       * If the viewport is smaller than the document height
       * then there'll be scrollbars taking up width.
       * Simply removing the scroll bars causes layoutshift.
       *
       * If we're opening a lock, set all to:
       * - overflow = scroll: to keep the scroll bar,
       * - position = fixed: to prevent scrolling and thus removes the scroll control from the scroll track
       * -
       */
      if (window.innerHeight < document.body.scrollHeight) {
        document.body.style.overflowY = (!!isOpen && 'scroll') || 'auto';
        document.body.style.position = (!!isOpen && 'fixed') || 'static';
      }

      window.scrollTo({ top });
    },
    [isOpen, stack, top]
  );

  useKeyboardEvent('Escape', handlePop, [handlePop]);

  return (
    <ScreenLockContext.Provider
      value={{
        isOpen,
        stack,
        top,
        push: handlePush,
        pop: handlePop,
      }}
    >
      {children}
    </ScreenLockContext.Provider>
  );
}
