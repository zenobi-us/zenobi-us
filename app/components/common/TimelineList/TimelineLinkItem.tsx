import { useCallback, type ReactNode } from 'react';

import { Link } from '~/components/ds/link/Link';

import { useTimelineItem } from './TimelineList';
import { TimelineItem } from './TimelineItem';

export function TimelineLinkItem<
  TItem extends {
    title: string;
    date: Date;
  }
>({
  linkRenderer,
  dateRenderer,
  createHref,
  tagger,
  getKey,
}: {
  linkRenderer?: (
    item: TItem & { href: string; className?: string }
  ) => ReactNode;
  dateRenderer?: ({ date }: { date: Date }) => ReactNode;
  createHref: (item: TItem) => string;
  tagger?: (item: TItem) => string[];
  getKey?: (item: TItem) => string;
}) {
  const item = useTimelineItem<TItem>();
  const tagsToDisplay = tagger ? tagger(item).filter(Boolean) : [];
  const renderLink = useCallback(
    (item: TItem) => {
      const className = 'inline whitespace-normal';
      if (!linkRenderer) {
        return (
          <Link
            className={className}
            href={createHref(item)}
          >
            {item.title}
          </Link>
        );
      }

      return linkRenderer({ ...item, href: createHref(item), className });
    },
    [createHref, linkRenderer]
  );

  return (
    <TimelineItem
      key={getKey(item)}
      date={item.date}
      dateRenderer={dateRenderer}
      tags={tagsToDisplay}
    >
      {renderLink(item)}
    </TimelineItem>
  );
}
