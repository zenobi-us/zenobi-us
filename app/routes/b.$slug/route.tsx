import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getPost } from '~/services/Content/posts';
import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getSiteData } from '~/services/Content/siteData';
import { BrowserCmsContent } from '~/components/common/cmscontent/CmsContent';

export async function loader({ params }: LoaderFunctionArgs) {
  const [post, siteData] = await Promise.all([
    getPost(params.slug),
    getSiteData(),
  ]);

  return Response.json({
    siteData,
    post,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...createSiteMeta(data)];
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page>
      {data.post.banner && (
        <Page.Banner
          src={data.post.banner.src}
          credit={data.post.banner?.credit}
        />
      )}
      <Page.Header title={data.post.title}>
        <div className="flex items-center gap-2">
          <Page.Header.Date date={data.post.date} />
          <Page.Header.Tags tags={data.post.tags} />
        </div>
      </Page.Header>
      <Page.Block direction="column">
        <BrowserCmsContent
          content={data.post.mdx}
          className="prose-base"
        />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
