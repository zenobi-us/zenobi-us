import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getPosts } from '~/services/Content/posts';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import type { Loader as RootLoader } from '~/root';
import {
  mapPostListFromResponse,
  mapPostListToResponse,
  PostListPage,
} from '~/components/post/PostListPage';

export function loader() {
  const posts = getPosts();
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
  const data = useLoaderData<Loader>();
  const posts = mapPostListFromResponse(data);

  return <PostListPage posts={posts} />;
}
