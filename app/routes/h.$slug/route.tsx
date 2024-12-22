import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';

import type { Loader as RootLoader } from '~/root';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getHelpPage, getHelpPages } from '~/services/Content/helps';

import {
  HelpDetailPage,
  mapHelpPageDetailFromResponse,
  mapHelpPageDetailToResponse,
} from '../../components/help/HelpDetailPage';

export async function loader({ params }: LoaderFunctionArgs) {
  const page = getHelpPage(params.slug);
  return mapHelpPageDetailToResponse(page);
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

export const getStaticPaths = async () => {
  const pages = await getHelpPages();
  return pages.map((page) => $path('/h/:slug', { slug: page._meta.slug }));
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  const page = mapHelpPageDetailFromResponse(data);
  return <HelpDetailPage page={page} />;
}
