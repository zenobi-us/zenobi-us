import { useContext } from 'react';

import { LinkContext } from './LinkContext';

export function useLinkComponent() {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error('LinkProvider is missing');
  }
  return context.component;
}
