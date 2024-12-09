import type { PropsWithChildren } from 'react';

export function ListItem(props: PropsWithChildren) {
  return <li className="pl-4 leading-6">{props.children}</li>;
}
