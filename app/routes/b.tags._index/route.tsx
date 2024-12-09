import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';

import { getTags } from '~/services/Content/tags';
import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getSiteData } from '~/services/Content/siteData';

export async function loader() {
  const [tags, siteData] = await Promise.all([getTags(), getSiteData()]);
  return Response.json({
    tags,
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
      <Page.Header title="All tags" />

      <Page.Block direction="column">
        <div className="flex flex-row flex-wrap gap-2 w-full">
          {data.tags.map((tag) => {
            return (
              <Link
                key={tag}
                className="text-text-link p-4"
                to={$path('/b/tags/:tag', { tag })}
              >
                {tag}
              </Link>
            );
          })}
        </div>
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
