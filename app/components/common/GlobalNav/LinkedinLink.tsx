import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import type { HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: 'flex font-page-heading',
});

export function LinkedinLink({
  className,
  children,
}: HTMLAttributes<HTMLAnchorElement>) {
  const styles = Styles();
  return (
    <a
      href="https://www.linkedin.com/in/zenobiusjiricek/?ref=zenobi.us"
      title="Zenobius Jiricek on LinkedIn"
      className={classnames(className, 'linkedn-link', styles)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <LinkedInLogoIcon
        width={32}
        height={32}
      />
      {children}
    </a>
  );
}
