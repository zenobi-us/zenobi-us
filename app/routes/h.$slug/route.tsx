import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';

import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getSiteData } from '~/services/Content/siteData';
import { BrowserCmsContent } from '~/components/common/cmscontent/CmsContent';
import { getHelpPage, getHelpPages } from '~/services/Content/helps';

export async function loader({ params }: LoaderFunctionArgs) {
  const [page, siteData] = await Promise.all([
    getHelpPage(params.slug),
    getSiteData(),
  ]);

  return Response.json({
    siteData,
    page,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...createSiteMeta(data)];
};

export const getStaticPaths = async () => {
  const pages = await getHelpPages();
  return pages.map((page) => $path('/h/:slug', { slug: page._meta.slug }));
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page>
      <Page.Header title={data.page.title}>
        <div className="flex items-center gap-2">
          <Page.Header.Date date={data.page.date} />
          <Page.Header.Tags tags={data.page.tags} />
        </div>
      </Page.Header>
      <Page.Block direction="column">
        <BrowserCmsContent
          content={data.page.mdx}
          className="prose-base"
        />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
