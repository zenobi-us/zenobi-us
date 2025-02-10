import type { PropsWithChildren } from 'react';

export function InlineCodeBlock(props: PropsWithChildren) {
  return (
    <code className="[&:not(pre_code)]:bg-background-overlay rounded-md px-1 py-0 text-sm">
      {props.children}
    </code>
  );
}
