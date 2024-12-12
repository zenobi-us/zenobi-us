import { BrowserCmsContent } from '../cmscontent/CmsContent';

import { useTimelineItem } from './TimelineList';
import { TimelineItem } from './TimelineItem';

export function TimelineSummaryItem<
  TItem extends {
    _meta: {
      slug: string;
    };
    template: string;
    date: string;
    mdx: string;
    tags: string[];
  }
>() {
  const item = useTimelineItem<TItem>();

  if (item.template !== 'summary') {
    return null;
  }

  return (
    <TimelineItem
      key={item._meta.slug}
      date={new Date(item.date)}
      tags={item.tags}
    >
      <BrowserCmsContent content={item.mdx} />
    </TimelineItem>
  );
}
