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
    <header
      data-testid="page-header"
      className={classnames('page-header', className, styles.block())}
    >
      <h2
        data-testid="page-header-title"
        className={classnames('page-header__title', styles.title())}
      >
        {title}
      </h2>
      {children && (
        <div
          data-testid="page-header-meta"
          className="page-header__meta flex w-full flex-col gap-2"
        >
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

export function formatPageHeaderDate(date: string | Date) {
  return Sugar.Date.medium(new Date(date));
}

export function PageHeaderDate({ date }: { date: string }) {
  const formattedDate = formatPageHeaderDate(date);

  return (
    <small
      data-testid="page-header-date"
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
  return (
    <p
      data-testid="page-header-subtitle"
      className={styles.subtitle()}
    >
      {children}
    </p>
  );
}

export function PageHeaderStage({ children }: PropsWithChildren) {
  const styles = PageHeaderStyles();
  return (
    <p
      data-testid="page-header-stage"
      className={styles.stage()}
    >
      {children}
    </p>
  );
}

export function PageHeaderDescription({ children }: PropsWithChildren) {
  const styles = PageHeaderStyles();
  return (
    <p
      data-testid="page-header-description"
      className={styles.description()}
    >
      {children}
    </p>
  );
}

export function PageHeaderTags({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          href={$path('/b/tags/:tag', { tag })}
        />
      ))}
    </>
  );
}

export function PageHeaderParentLinkButton({
  label,
  href,
}: PropsWithChildren<{ href: string; label: string }>) {
  return (
    <div
      data-testid="page-header-parent-link-button"
      className="flex flex-row w-full gap-x-2"
    >
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
