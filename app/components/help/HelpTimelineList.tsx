import sugar from 'sugar';
import { $path } from 'remix-routes';
import intersection from 'lodash/intersection';

import { TimelineList } from '../common/TimelineList/TimelineList';
import { createDateSorter } from '../../core/dates/core-dates';

import type { HelpPageSummary, HelpPageSummaryList } from './HelpListPage';

const byHelpPageEntryDateSorter = createDateSorter<HelpPageSummary>((page) => {
  return sugar.Date.create(page.date || undefined);
}, 'desc');

function getHelpPageYear(page: HelpPageSummary) {
  if (!page.date) {
    return '';
  }

  const year = sugar.Date.create(page.date).getFullYear();
  return year.toString();
}

export function HelpTimelineList({ pages }: { pages: HelpPageSummaryList }) {
  return (
    <TimelineList
      className="mt-2"
      collection={pages}
      getItemKey={(page) => {
        return page._meta.slug;
      }}
      sorter={byHelpPageEntryDateSorter}
      getGroupKey={getHelpPageYear}
    >
      <TimelineList.LinkItem<HelpPageSummary>
        createHref={(page) => {
          return $path('/h/:slug', { slug: page._meta.id });
        }}
        tagger={(page) => {
          return intersection(page.tags, ['package', 'project']);
        }}
      />
    </TimelineList>
  );
}
