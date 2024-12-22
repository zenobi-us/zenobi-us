import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';

import { getPost, getPosts } from '~/services/Content/posts';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import type { Loader as RootLoader } from '~/root';
import {
  mapPostDetailToResponse,
  mapPostFromResponse,
  PostPage,
} from '~/components/post/PostPage';

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPost(params.slug);
  return mapPostDetailToResponse(post);
}
export type Loader = typeof loader;

export const getStaticPaths = async () => {
  const posts = await getPosts();
  return posts.map((post) => $path('/b/:slug', { slug: post._meta.id }));
};

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
  const post = mapPostFromResponse(data);
  return <PostPage post={post} />;
}
