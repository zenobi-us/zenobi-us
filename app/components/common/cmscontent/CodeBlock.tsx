import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  slots: {
    block: [
      'text-text-quote leading-4 p-2 text-left',
      'backdrop-blur-sm bg-background-card dark:bg-background-card',
      'overflow-x-auto',
      '[&_code]:relative',
      '[&_code]:z-10',
      '[&_code]:py-1 [&_code]:px-0',
    ],
  },
});

export function CodeBlock({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>) {
  const styles = Styles();

  return (
    <pre
      className={classnames(className, styles.block())}
      {...props}
    />
  );
}
