import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function ClientOnlyPortal({
  children,
  selector,
}: PropsWithChildren<{
  selector: string;
}>) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(
    function FindAndStoreElement() {
      ref.current = document.querySelector(selector);
      setMounted(true);
    },
    [selector],
  );

  if (!mounted) {
    return null;
  }

  if (!ref.current) {
    return null;
  }

  return createPortal(children, ref.current);
}
