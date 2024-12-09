import type { PropsWithChildren } from 'react';

export function UnorderedList(props: PropsWithChildren) {
  return <ul className="list-disc pl-4">{props.children}</ul>;
}
