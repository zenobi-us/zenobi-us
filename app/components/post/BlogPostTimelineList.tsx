import sugar from 'sugar';
import { $path } from 'remix-routes';
import intersection from 'lodash/intersection';

import {
  TimelineList,
  TimelineListGroupTitle,
} from '../common/TimelineList/TimelineList';
import { createDateSorter } from '../../core/dates/core-dates';
import type { Post } from 'content-collections';
import { TimelineItemDate } from '../common/TimelineList/TimelineItem';

const byPostEntryDateSorter = createDateSorter<Post>((post) => {
  return sugar.Date.create(post.date || undefined);
}, 'desc');

function getPostYear(post: Post) {
  if (!post.date) {
    return '';
  }

  const year = sugar.Date.create(post.date).getFullYear();
  return year.toString();
}

function getPostSlug(post: Post) {
  return post._meta.slug;
}

function getPostTags(post: Post) {
  const tags = intersection(post.tags, ['package', 'project']);

  return [...tags, post.stage === 'draft' ? 'draft' : ''];
}

function getPostHref(post: Post) {
  return $path('/b/:slug', { slug: post._meta.id });
}

export function BlogPostTimelineList({ posts }: { posts: Post[] }) {
  return (
    <TimelineList
      className="mt-2"
      collection={posts}
      getItemKey={getPostSlug}
      sorter={byPostEntryDateSorter}
      getGroupKey={getPostYear}
      renderGroupTitle={({ year }) => (
        <TimelineListGroupTitle
          year={year}
          className="text-text-link/40"
        />
      )}
    >
      <TimelineList.LinkItem
        createHref={getPostHref}
        tagger={getPostTags}
        dateRenderer={({ date }) => (
          <TimelineItemDate
            date={date}
            className="text-text-link/60"
          />
        )}
      />
      <TimelineList.SummaryItem />
    </TimelineList>
  );
}
