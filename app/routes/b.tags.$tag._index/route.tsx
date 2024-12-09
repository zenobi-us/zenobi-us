import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { $path } from 'remix-routes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { getPostsWithTag } from '~/services/Content/tags';
import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getSiteData } from '~/services/Content/siteData';
import { Tag } from '~/components/post/Tag';
import { BlogPostTimelineList } from '~/components/post/BlogPostTimelineList';

async function getContent(tag?: string) {
  try {
    const posts = getPostsWithTag(tag);

    if (!posts) {
      throw new Response('No posts with this tag', { status: 404 });
    }
    return posts;
  } catch (error) {
    console.error('Failed to load posts data', error);
    throw new Error('Failed to load posts data');
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [posts, siteData] = await Promise.all([
    getContent(params.tag),
    getSiteData(),
  ]);
  return Response.json({
    posts,
    siteData,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...createSiteMeta(data)];
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();

  if (!params.tag) {
    return (
      <Page>
        <Page.Block direction="column">
          <div className="flex flex-row gap-4">No tag provided</div>
        </Page.Block>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header title={`Posts tagged with "${params.tag}"`}>
        <div className="flex flex-row gap-4">
          <Tag
            icon={<ArrowLeftIcon />}
            label="Return to Posts"
            href={$path('/b')}
          />
          <Tag
            icon={<ArrowLeftIcon />}
            label="All Tags"
            href={$path('/b/tags')}
          />
        </div>
      </Page.Header>

      <Page.Block direction="column">
        <div className="flex flex-row gap-4">
          <BlogPostTimelineList posts={data.posts} />
        </div>
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
