import { Link } from '~/components/ds/link/Link';

import { useTimelineItem } from './TimelineList';
import { TimelineItem } from './TimelineItem';

export function TimelineLinkItem<
  TItem extends {
    _meta: {
      slug: string;
      id: string;
    };
    tags?: string[];
    content: string;
    date: Date;
    title: string;
    mdx: string;
  }
>({
  createHref,
  tagger,
}: {
  createHref: (item: TItem) => string;
  tagger?: (item: TItem) => string[];
}) {
  const item = useTimelineItem<TItem>();
  const tagsToDisplay = tagger ? tagger(item).filter(Boolean) : [];
  return (
    <TimelineItem
      key={item._meta.slug}
      date={item.date}
      tags={tagsToDisplay}
    >
      <Link
        className="inline whitespace-normal"
        href={createHref(item)}
      >
        {item.title}
      </Link>
    </TimelineItem>
  );
}
