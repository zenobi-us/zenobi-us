import { GitHubLogoIcon } from '@radix-ui/react-icons';
import type { HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  slots: {
    block: 'text-page-heading no-underline',
  },
});

export function GithubLink({
  className,
  children,
}: HTMLAttributes<HTMLAnchorElement>) {
  const styles = Styles();

  return (
    <a
      href="https://github.com/airtonix?ref=zenobi.us"
      title="Zenobius Jiricek on GitHub"
      rel="noopener noreferrer"
      target="_blank"
      className={classnames(className, styles.block())}
    >
      <GitHubLogoIcon
        width={32}
        height={32}
      />
      {children}
    </a>
  );
}
