import { type PropsWithChildren } from 'react';

import type { LinkContextShape } from './LinkContext';
import { LinkContext } from './LinkContext';

export function LinkProvider({
  children,
  component = 'a',
}: PropsWithChildren<Pick<LinkContextShape, 'component'>>) {
  return (
    <LinkContext.Provider value={{ component }}>
      {children}
    </LinkContext.Provider>
  );
}
