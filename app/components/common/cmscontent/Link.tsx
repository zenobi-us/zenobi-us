import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: [
    'text-text-link',
    'print:text-xs',
    'print:content-[attr(href)]',
    'active:text-text-highlighted',
    'hover:text-text-hover',
    'visited:text-text-hover',
  ],
});

export function Link({
  children,
  href,
  className,
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  const isExternal = !!href && href.startsWith('http');
  const styles = Styles();
  if (isExternal) {
    return (
      <a
        className={classnames(className, styles)}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      className={classnames(className, styles)}
      href={href}
    >
      {children}
    </a>
  );
}
