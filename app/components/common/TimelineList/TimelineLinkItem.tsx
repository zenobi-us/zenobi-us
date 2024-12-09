import { Link } from '~/components/ds/link/Link';

import { useTimelineItem } from './TimelineList';
import { TimelineItem } from './TimelineItem';

export function TimelineLinkItem<
  TItem extends {
    _meta: {
      slug: string;
    };
    content: string;
    date?: string;
    title: string;
    mdx: string;
  }
>({
  createHref,
  tagger,
}: {
  createHref: (post: TItem) => string;
  tagger?: (item: TItem) => string[];
}) {
  const item = useTimelineItem<TItem>();
  const tagsToDisplay = tagger ? tagger(item).filter(Boolean) : [];
  return (
    <TimelineItem
      key={item._meta.slug}
      date={new Date(item.date)}
      tags={tagsToDisplay}
    >
      <Link href={createHref(item)}>{item.title}</Link>
    </TimelineItem>
  );
}
