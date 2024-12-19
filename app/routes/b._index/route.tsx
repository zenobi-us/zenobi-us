import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getPosts } from '~/services/Content/posts';
import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { getSiteData } from '~/services/Content/siteData';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { BlogPostTimelineList } from '~/components/post/BlogPostTimelineList';

export async function loader() {
  const [posts, siteData] = await Promise.all([getPosts(), getSiteData()]);

  return Response.json({
    posts: posts.map((post) => ({
      date: post.date,
      title: post.title,
      tags: post.tags,
      _meta: {
        slug: post._meta.slug,
        id: post._meta.id,
      },
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
      <Page.Block direction="column">
        <BlogPostTimelineList posts={data.posts} />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
