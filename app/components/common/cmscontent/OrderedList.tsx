import type { PropsWithChildren } from 'react';

export function OrderedList(props: PropsWithChildren) {
  return <ol className="list-decimal">{props.children}</ol>;
}
