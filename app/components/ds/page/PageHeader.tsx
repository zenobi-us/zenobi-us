import type { PropsWithChildren, ReactNode } from 'react';
import { tv } from 'tailwind-variants';
import Sugar from 'sugar';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { $path } from 'remix-routes';

import { classnames } from '~/core/classnames';
import { Tag } from '~/components/post/Tag';

import { Link } from '../link/Link';

const PageHeaderStyles = tv({
  slots: {
    block: 'w-full mx-auto my-0 pt-8 pb-8 pl-4 pr-4 gap-2 flex flex-col',
    title: 'font-serif font-semibold text-2xl text-text-base mt-4 mb-0',
    subtitle: 'font-page-meta text-text-base',
    stage: 'font-page-meta text-text-muted',
    tag: 'font-page-meta text-text-muted text-14',
    description: 'font-paragraph text-text-base',
    tags: 'font-page-meta text-text-muted',
  },
});

export type PageHeaderProps = {
  className?: string;
  title: ReactNode;
  date?: string | null;
};

export const PageHeader = ({
  className,
  title,
  children,
}: PropsWithChildren<PageHeaderProps>) => {
  const styles = PageHeaderStyles();
  return (
    <header className={classnames('page-header', className, styles.block())}>
      <h2 className={classnames('page-header__title', styles.title())}>
        {title}
      </h2>
      {children && (
        <div className="page-header__meta flex w-full flex-col gap-2">
          {children}
        </div>
      )}
    </header>
  );
};

PageHeader.ParentLinkButton = PageHeaderParentLinkButton;
PageHeader.Date = PageHeaderDate;
PageHeader.Subtitle = PageHeaderSubtitle;
PageHeader.Tags = PageHeaderTags;
PageHeader.Stage = PageHeaderStage;
PageHeader.Description = PageHeaderDescription;

export function PageHeaderDate({ date }: { date: string }) {
  const formattedDate = Sugar.Date.medium(new Date(date));

  return (
    <small
      className={classnames(
        'page-header__date',
        'font-serif text-base text-text-muted'
      )}
    >
      {formattedDate}
    </small>
  );
}

export function PageHeaderSubtitle({ children }: PropsWithChildren) {
  const styles = PageHeaderStyles();
  return <p className={styles.subtitle()}>{children}</p>;
}

export function PageHeaderStage({ children }: PropsWithChildren) {
  const styles = PageHeaderStyles();
  return <p className={styles.stage()}>{children}</p>;
}

export function PageHeaderDescription({ children }: PropsWithChildren) {
  const styles = PageHeaderStyles();
  return <p className={styles.description()}>{children}</p>;
}

export function PageHeaderTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-row gap-x-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          href={$path('/b/tags/:tag', { tag })}
        />
      ))}
    </div>
  );
}

export function PageHeaderParentLinkButton({
  label,
  href,
}: PropsWithChildren<{ href: string; label: string }>) {
  return (
    <div className="flex flex-row w-full gap-x-2">
      <Link
        className="text-link-link bg-background-shadow py-1 px-2 flex items-center gap-x-1"
        href={href}
      >
        <ChevronLeftIcon className="w-4 h-4" />
        {label}
      </Link>
    </div>
  );
}
