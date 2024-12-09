import { useRef, type PropsWithChildren } from 'react';

import { useDelegatedReactRouterLinks } from './useDelegatedReactRouterLinks';

export function ScrollFix({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  useDelegatedReactRouterLinks(ref);
  return <div ref={ref}>{children}</div>;
}
