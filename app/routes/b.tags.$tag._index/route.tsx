import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';

import { getPostsWithTag } from '~/services/Content/tags';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import {
  mapPostListFromResponse,
  mapPostListToResponse,
} from '~/components/post/PostListPage';
import type { Loader as RootLoader } from '~/root';

import { TagPostListPage } from '../../components/post/TagPostListPage';

export async function loader({ params }: LoaderFunctionArgs) {
  const posts = getPostsWithTag(params.tag);
  return mapPostListToResponse(posts);
}

export type Loader = typeof loader;

export const meta: MetaFunction<
  Loader,
  {
    root: RootLoader;
  }
> = ({ matches }) => {
  const siteData = matches.find((match) => match.id === 'root').data.siteData;

  return [...createSiteMeta({ description: siteData.description })];
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const posts = mapPostListFromResponse(data);

  return (
    <TagPostListPage
      tag={params.tag}
      posts={posts}
    />
  );
}
