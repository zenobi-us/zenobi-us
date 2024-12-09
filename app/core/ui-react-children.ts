import type { ReactElement, ReactNode } from 'react';
import { isValidElement } from 'react';
import flattenWithKeys from 'react-keyed-flatten-children';

/** An improved version of React.Children.toArray().
 * This function:
 * 1- Removes falsy children and flatten children in fragments.
 * 2- Traverses through fragments and flattens them.
 * 3- Keeps ids stable across renders as a consequence of 1 and 2.
 */
export const flattenElements = (
  children: ReactNode,
  options?: { depth?: number; keys?: (number | string)[] }
) => {
  return flattenWithKeys(children, options?.depth, options?.keys).filter(
    isValidElement
  ) as ReactElement[];
};

export const flattenChildren = flattenWithKeys;
