import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getTags } from '~/services/Content/tags';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { TagsListPage } from '~/components/post/TagsListPage';
import type { Loader as RootLoader } from '~/root';

export async function loader() {
  const tags = getTags();
  return tags;
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
  const tags = useLoaderData<typeof loader>();
  return <TagsListPage tags={tags} />;
}
