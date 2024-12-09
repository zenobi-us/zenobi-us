import sugar from 'sugar';
import { $path } from 'remix-routes';

import { TimelineList } from '../common/TimelineList/TimelineList';
import { createDateSorter } from '../../core/dates/core-dates';
import type { Me } from 'content-collections';

const byResumeEntryDateSorter = createDateSorter<Me>((page) => {
  return sugar.Date.create(page.date || undefined);
}, 'desc');

function getResumeYear(page: Me) {
  if (!page.date) {
    return '';
  }

  const year = sugar.Date.create(page.date).getFullYear();
  return year.toString();
}

function getResumeSlug(page: Me) {
  return page._meta.slug;
}

function getResumeHref(page: Me) {
  return $path('/me/resume/:id', { id: page._meta.id });
}

export function ResumeTimelineList({ collection }: { collection: Me[] }) {
  return (
    <TimelineList
      className="mt-2"
      collection={collection}
      getItemKey={getResumeSlug}
      sorter={byResumeEntryDateSorter}
      getGroupKey={getResumeYear}
    >
      <TimelineList.LinkItem<Me> createHref={getResumeHref} />
    </TimelineList>
  );
}
