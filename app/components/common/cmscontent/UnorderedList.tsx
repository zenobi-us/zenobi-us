import type { PropsWithChildren } from 'react';

export function UnorderedList(props: PropsWithChildren) {
  return (
    <ul className="p-0 m-0 list-outside list-disc pl-4">{props.children}</ul>
  );
}
