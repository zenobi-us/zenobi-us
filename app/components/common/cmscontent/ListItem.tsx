import type { PropsWithChildren } from 'react';

export function ListItem(props: PropsWithChildren) {
  return <li className="px-0 py-1 m-0 leading-6">{props.children}</li>;
}
