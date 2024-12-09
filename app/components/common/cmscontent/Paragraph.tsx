import type { PropsWithChildren } from 'react';

export function Paragraph(props: PropsWithChildren) {
  return <p className="leading-6 my-2 first:mt-0">{props.children}</p>;
}
