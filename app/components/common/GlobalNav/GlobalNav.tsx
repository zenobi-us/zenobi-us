import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Box } from '~/components/ds/box/Box';
import { Button } from '~/components/ds/button/Button';

import { LinkList, type LinkListVariants } from '../../ds/linklist/LinkList';
import { Link } from '../../ds/link/Link';
import { Block } from '../Block/Block';
import { Avatar } from '../favicons/Avatar';
import { ContactFormDrawer } from '../GlobalFooter/ContactFormDrawer';

import { useCurrentPath } from './useNavigation';

const Styles = tv({
  slots: {
    block: ['flex flex-row justify-between items-center', 'print:hidden'],
    inner: 'flex flex-row justify-start items-center w-full mr-4',
    logo: 'gap-4 items-center',
    sociallinks: 'flex justify-end text-text-informative',
    navlinks: 'flex flex-row gap-4 ml-2 justify-start w-full',
    link: '',
    external: 'flex flex-row gap-4',
  },
  variants: {
    horizontal: {
      true: {},
    },
    vertical: {
      true: {},
    },
    isAncestor: {
      true: {
        link: [
          'visited:bg-background-link-active visited:text-text-link-active [text-decoration: none]',
          'visited:hover:bg-background-card visited:hover:text-text-positive visited:hover:[text-decoration: none]',
        ],
      },
    },
    useLogo: {
      true: {
        inner: '',
        logo: 'pr-2',
        navlinks: 'border-l-2 border-l-border-informative pl-4',
      },
    },
  },
});

export function GlobalNav({
  className,
  useLogo,
  currentPath,
  direction = 'row',
}: {
  className?: string;
  currentPath?: string;
  useLogo?: boolean;
} & LinkListVariants) {
  const styles = Styles({ useLogo });
  const path = useCurrentPath(currentPath);

  return (
    <Block className={classnames(className, styles.block())}>
      <div className={classnames(styles.inner())}>
        <div className={classnames(styles.logo())}>
          {useLogo && (
            <Link
              className="flex items-center gap-2"
              href="/"
            >
              <Avatar size={26} />
              Zenobius
            </Link>
          )}
        </div>
        <LinkList
          className={classnames('md:w-full justify-start', styles.navlinks())}
          direction={direction}
        >
          <Link
            href="/b"
            className={classnames(
              styles.link({ isAncestor: path.isAncestor('/b') })
            )}
          >
            Posts
          </Link>
        </LinkList>{' '}
        <Box
          className={styles.sociallinks()}
          direction={direction}
        >
          <ContactFormDrawer anchor="bottom">
            <Button
              link
              className="flex-shrink-0"
            >
              Contact Me
            </Button>
          </ContactFormDrawer>
        </Box>
      </div>
    </Block>
  );
}
