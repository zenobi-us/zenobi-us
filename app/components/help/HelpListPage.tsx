import * as superjson from 'superjson';

import type { Help } from 'content-collections';
import { PostEnd } from '../common/PostEnd/PostEnd';
import { Page } from '../ds/page/Page';

import { HelpTimelineList } from './HelpTimelineList';

export function mapDbHelpPages(helps: Help[]) {
  return helps.map((help) => ({
    date: help.date,
    title: help.title,
    tags: help.tags,
    _meta: {
      slug: help._meta.slug,
      id: help._meta.id,
    },
  }));
}

export function mapHelpPageListToResponse(posts: Help[]) {
  return superjson.stringify(mapDbHelpPages(posts));
}

export type HelpPageSummaryList = ReturnType<typeof mapDbHelpPages>;
export type HelpPageSummary = HelpPageSummaryList[number];

export function mapHelpListFromResponse(
  pages: ReturnType<typeof mapHelpPageListToResponse>
) {
  return superjson.parse<HelpPageSummaryList>(pages);
}

export function HelpListPage({ pages }: { pages: HelpPageSummaryList }) {
  return (
    <Page>
      <Page.Header title="Thoughts" />

      <Page.Block direction="column">
        <HelpTimelineList pages={pages} />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
