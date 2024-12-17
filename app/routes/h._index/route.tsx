import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { getSiteData } from '~/services/Content/siteData';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { HelpTimelineList } from '~/components/help/HelpTimelineList';
import { getHelpPages } from '~/services/Content/helps';

export async function loader() {
  const [pages, siteData] = await Promise.all([getHelpPages(), getSiteData()]);

  return Response.json({
    pages: pages.map((page) => ({
      title: page.title,
      date: page.date,
      tags: page.tags,
    })),
    siteData,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...createSiteMeta(data)];
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page>
      <Page.Header title="Thoughts" />

      <Page.Block direction="column">
        <HelpTimelineList pages={data.pages} />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
