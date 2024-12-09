import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function useClientPortal({ selector }: { selector: string }) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(
    function FindAndStoreElement() {
      const element = document.querySelector(selector);
      if (!element) {
        return;
      }
      ref.current = element;
      setMounted(true);
    },
    [selector]
  );

  const create = useCallback(
    (children: ReactNode) => {
      if (!mounted) {
        return null;
      }
      if (!ref.current) {
        return null;
      }

      return createPortal(children, ref.current);
    },
    [mounted]
  );

  return {
    createPortal: create,
  };
}
