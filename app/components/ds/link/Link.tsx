import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { useLinkComponent } from './useLinkComponent';

const Styles = tv({
  base: ['underline whitespace-normal'],
  variants: {
    current: {
      true: [
        'text-text-positive/80',
        'hover:text-text-positive',
        'visited:bg-background-link-active visited:text-text-positive [text-decoration: none]',
        'visited:hover:bg-background-card visited:hover:text-text-positive visited:hover:[text-decoration: none]',
      ],
      false: [
        'text-text-link',
        'hover:text-text-link-hover',
        'active:text-text-link-active',
        'visited:text-text-link-visited',
      ],
    },
  },
});

export function Link({
  children,
  href,
  className,
  current,
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  VariantProps<typeof Styles>) {
  const LinkComponent = useLinkComponent();
  const isExternal = !!href && href.startsWith('http');
  const styles = Styles({ current });
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
