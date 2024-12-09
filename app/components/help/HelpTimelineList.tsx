import sugar from 'sugar';
import { $path } from 'remix-routes';
import intersection from 'lodash/intersection';

import { TimelineList } from '../common/TimelineList/TimelineList';
import { createDateSorter } from '../../core/dates/core-dates';
import type { Help } from 'content-collections';

const byHelpPageEntryDateSorter = createDateSorter<Help>((page) => {
  return sugar.Date.create(page.date || undefined);
}, 'desc');

function getHelpPageYear(page: Help) {
  if (!page.date) {
    return '';
  }

  const year = sugar.Date.create(page.date).getFullYear();
  return year.toString();
}

function getHelpPageSlug(page: Help) {
  return page._meta.slug;
}

function getHelpPageTags(page: Help) {
  return intersection(page.tags, ['package', 'project']);
}

function getHelpPaeHref(page: Help) {
  return $path('/h/:slug', { slug: page._meta.id });
}

export function HelpTimelineList({ pages }: { pages: Help[] }) {
  return (
    <TimelineList
      className="mt-2"
      collection={pages}
      getItemKey={getHelpPageSlug}
      sorter={byHelpPageEntryDateSorter}
      getGroupKey={getHelpPageYear}
    >
      <TimelineList.LinkItem
        createHref={getHelpPaeHref}
        tagger={getHelpPageTags}
      />
    </TimelineList>
  );
}
