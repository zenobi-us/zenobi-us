import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { useLinkComponent } from './useLinkComponent';

const Styles = tv({
  base: [
    'underline',
    'text-text-link',
    'hover:text-text-link-hover',
    'active:text-text-link-active',
    'visited:text-text-link-visited',
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
  const LinkComponent = useLinkComponent();
  const isExternal = !!href && href.startsWith('http');
  const styles = Styles();
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <LinkComponent
      className={classnames('link', className, styles)}
      href={href}
      {...externalProps}
    >
      {children}
    </LinkComponent>
  );
}
