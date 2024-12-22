import * as superjson from 'superjson';

import { BrowserCmsContent } from '~/components/common/cmscontent/CmsContent';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { Page } from '~/components/ds/page';

import type { Help } from 'content-collections';

export function mapDbHelpPage(help: Help) {
  return {
    date: help.date,
    title: help.title,
    tags: help.tags,
    mdx: help.mdx,
    _meta: {
      slug: help._meta.slug,
      id: help._meta.id,
    },
  };
}

export function mapHelpPageDetailToResponse(help: Help) {
  return superjson.stringify(mapDbHelpPage(help));
}

export type HelpPageDetail = ReturnType<typeof mapDbHelpPage>;

export function mapHelpPageDetailFromResponse(
  page: ReturnType<typeof mapHelpPageDetailToResponse>
) {
  return superjson.parse<HelpPageDetail>(page);
}

export function HelpDetailPage({ page }: { page: HelpPageDetail }) {
  return (
    <Page>
      <Page.Header title={page.title}>
        <div className="flex items-center gap-2">
          <Page.Header.Date date={page.date} />
          <Page.Header.Tags tags={page.tags} />
        </div>
      </Page.Header>
      <Page.Block direction="column">
        <BrowserCmsContent
          content={page.mdx}
          className="prose-base"
        />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
