import { tv } from 'tailwind-variants';
import type { HTMLAttributes } from 'react';

import { classnames } from '~/core/classnames';

import { useClientSideFaviconColourStorage } from './useClientSideFaviconColourStorage';
import { Logo, type LogoProps } from './Logo';

const Styles = tv({
  slots: {
    logo: ['flex items-center justify-center', 'min-w-8 m-0', 'text-text-link'],
    svg: ['transition-all duration-500 ease-in-out'],
    homeAvatar: [
      'flex items-center justify-center',
      'w-[--avatar-size] h-[--avatar-size]',
    ],
  },
});

type AvatarProps = HTMLAttributes<HTMLDivElement> &
  LogoProps & { size?: number };

export function Avatar({ size, className, ...props }: AvatarProps) {
  const colours = useClientSideFaviconColourStorage();
  const styles = Styles();

  return (
    <div
      data-testid="avatar"
      className={classnames(className, styles.logo())}
      {...props}
    >
      <Logo
        className={styles.svg()}
        style={{
          // @ts-expect-error - CSS Var
          '--avatar-size': `${size}px`,
        }}
        width={size}
        height={size}
        {...colours.value}
      />
    </div>
  );
}

const HomeAvatarStyles = tv({
  slots: {
    block: '',
    logo: '',
  },
});

export function HomeAvatar({ className, ...props }: AvatarProps) {
  const styles = HomeAvatarStyles();
  return (
    <div
      className={classnames('home-avatar', className, styles.block())}
      data-testid="home-avatar"
      role="img"
      style={{
        // @ts-expect-error - CSS Var
        '--avatar-size': `${props.size || 32}px`,
      }}
    >
      <Avatar
        {...props}
        className={styles.logo()}
      />
    </div>
  );
}
