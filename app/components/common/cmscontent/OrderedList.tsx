import type { PropsWithChildren } from 'react';

export function OrderedList(props: PropsWithChildren) {
  return <ol className="list-decimal pl-4">{props.children}</ol>;
}
