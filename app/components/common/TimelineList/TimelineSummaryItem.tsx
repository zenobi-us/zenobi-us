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
    title: string;
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
      slug={item._meta.slug}
      type={item.template}
      date={new Date(item.date)}
      title={item.title}
      tags={item.tags}
    >
      <BrowserCmsContent content={item.mdx} />
    </TimelineItem>
  );
}
