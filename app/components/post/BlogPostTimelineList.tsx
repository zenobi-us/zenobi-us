import sugar from 'sugar';
import { $path } from 'remix-routes';
import intersection from 'lodash/intersection';

import {
  TimelineList,
  TimelineListGroupTitle,
} from '../common/TimelineList/TimelineList';
import { createDateSorter } from '../../core/dates/core-dates';
import { TimelineItemDate } from '../common/TimelineList/TimelineItem';

import type { PostSummary } from './PostListPage';

const byPostEntryDateSorter = createDateSorter<PostSummary>((post) => {
  return sugar.Date.create(post.date || undefined);
}, 'desc');

function getPostYear(post: PostSummary) {
  if (!post.date) {
    return '';
  }

  const year = sugar.Date.create(post.date).getFullYear();
  return year.toString();
}

function getPostSlug(post: PostSummary) {
  return post._meta.slug;
}

function getPostTags(post: PostSummary) {
  const tags = intersection(post.tags, ['package', 'project']);

  return [...tags, post.stage === 'draft' ? 'draft' : ''];
}

function getPostHref(post: PostSummary) {
  return $path('/b/:slug', { slug: post._meta.id });
}

export function BlogPostTimelineList({ posts }: { posts: PostSummary[] }) {
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
        getKey={(post) => post._meta.slug}
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
