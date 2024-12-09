import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: [
    'text-left',
    'p-4 pl-8',
    'm-0 mt-4 mb-4 border-l-4 border-l-primary',
    '[&>*:last]:mb-0', // Remove margin-bottom from last child
  ],
});

export function Blockquote({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>) {
  const styles = Styles();
  return (
    <blockquote
      className={classnames(className, styles)}
      {...props}
    >
      {children}
    </blockquote>
  );
}
