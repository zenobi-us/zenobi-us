import { InstagramLogoIcon } from '@radix-ui/react-icons';
import type { HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: 'flex',
});

export function InstagramLink({
  className,
  children,
}: HTMLAttributes<HTMLAnchorElement>) {
  const styles = Styles();

  return (
    <a
      href="https://instagram.com/zenobi.us?ref=zenobi.us"
      title="Zenobius Jiricek on Instagram"
      rel="noopener noreferrer"
      target="_blank"
      className={classnames(className, 'instagram-link', styles)}
    >
      <InstagramLogoIcon
        width={32}
        height={32}
      />
      {children}
    </a>
  );
}
