import * as superjson from 'superjson';
import type { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Box } from '~/components/ds/box/Box';
import { Page, type PageProps } from '~/components/ds/page/Page';
import { LinkList } from '~/components/ds/linklist/LinkList';
import { Link } from '~/components/ds/link/Link';
import { Button } from '~/components/ds/button/Button';

import { HomeAvatar } from '../common/favicons/Avatar';
import { ContactFormDrawer } from '../common/GlobalFooter/ContactFormDrawer';
import type { SiteDatum } from 'content-collections';

const Styles = tv({
  slots: {
    block: '',
    container: [
      'flex flex-col flex-grow justify-center items-center',
      'text-serif text-4xl font-normal max-w-screen-md',
    ],

    splash: [
      'prose',
      'flex flex-col items-center justify-center',
      'font-splash font-page-heading font-weight-bold',
      'max-w-[640px]',
      'px-4',
      'grid grid-flow-col',
      'grid-areas-[logo,content,navigation]',
      'items-start gap-4 flex-col',
      'landscape:sm:grid-areas-[logo_content,._navigation]',
      'landscape:lx:grid-areas-[logo_content,._navigation]',
      'xl:grid-areas-[logo_content,._navigation]',
      'xl:grid-cols-[128px_auto]',
      'xl:max-w-[768px]',
    ],
    logo: ['area-[logo]', 'flex justify-start', 'mx-0 px-0 1xl:m-0'],
    navigation: [
      'area-[navigation]',
      'w-full px-4 flex flex-col',
      'text-2xl lg:text-3xl',
      '[&_.globalnav__inner]:flex-col',
      '[&_link-list]:gap-4',
      '[&_link-list]:flex-row',
    ],
    content: [
      'area-[content]',
      'text-2xl',
      'px-4 py-2',
      'portait:md:text-4xl',
      '[&_p]:mb-8',
      '[&_p]:leading-10',
      '[&>*]:font-serif',
      'lg:text-4xl',
      'xl:text-4xl',
      'landscape:sm:text-xl',
      'landscape:sm:[&_p]:leading-8',
      'landscape:sm:[&_p]:mb-2',
      'landscape:md:text-2xl',
      'landscape:md:[&_p]:leading-10',
      'landscape:lg:text-3xl',
    ],
  },
});

export function mapDbIntroPage(page: SiteDatum) {
  return {
    date: page.date,
    title: page.title,
    tags: page.tags,
    mdx: page.mdx,
    _meta: {
      slug: page._meta.slug,
      id: page._meta.id,
    },
  };
}

export function mapIntroPageToResponse(page: SiteDatum) {
  return superjson.stringify(mapDbIntroPage(page));
}

export type IntroPage = ReturnType<typeof mapDbIntroPage>;

export function mapIntroPageFromResponse(
  pages: ReturnType<typeof mapIntroPageToResponse>
) {
  return superjson.parse<IntroPage>(pages);
}

export function HomePage({
  children,
  className,
}: PropsWithChildren<PageProps & { currentPath: string }>) {
  const styles = Styles();

  return (
    <Page className={classnames('homepage', styles.block(), className)}>
      <Page.Block
        className={classnames('homepage__container', styles.container())}
      >
        <div className={classnames('homepage__splash', styles.splash())}>
          <HomeAvatar
            className={classnames('homepage__logo', styles.logo())}
            size={128}
          />

          <Box className={classnames('homepage__content', styles.content())}>
            {children}
          </Box>

          <LinkList
            direction="row"
            className={classnames(styles.navigation())}
          >
            <Link href="/b">Posts</Link>
            <ContactFormDrawer anchor="bottom">
              <Button link>Contact Me</Button>
            </ContactFormDrawer>
          </LinkList>
        </div>
      </Page.Block>
    </Page>
  );
}
