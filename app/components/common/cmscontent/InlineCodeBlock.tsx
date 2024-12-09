import type { PropsWithChildren } from 'react';

export function InlineCodeBlock(props: PropsWithChildren) {
  return (
    <code className="[&:not(pre_code)]:bg-background-overlay rounded-md p-1 text-sm">
      {props.children}
    </code>
  );
}
