import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import { getHelpPages } from '~/services/Content/helps';
import type { Loader as RootLoader } from '~/root';
import {
  HelpListPage,
  mapHelpListFromResponse,
  mapHelpPageListToResponse,
} from '~/components/help/HelpListPage';

export function loader() {
  const pages = getHelpPages();
  return mapHelpPageListToResponse(pages);
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
  const pages = mapHelpListFromResponse(data);

  return <HelpListPage pages={pages} />;
}
