import { createContext, type ElementType } from 'react';

export type LinkContextShape = {
  component: ElementType;
};
export const LinkContext = createContext<LinkContextShape>({
  component: 'a',
});
