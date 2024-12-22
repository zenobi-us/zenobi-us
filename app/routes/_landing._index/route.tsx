import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { BrowserCmsContent } from '~/components/common/cmscontent/CmsContent';
import { getIntro } from '~/services/Content/intros';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';
import type { Loader as RootLoader } from '~/root';
import {
  mapIntroPageFromResponse,
  mapIntroPageToResponse,
} from '~/components/home/HomePage';

export function loader() {
  const intro = getIntro();
  return mapIntroPageToResponse(intro);
}

export type Loader = ReturnType<typeof loader>;

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
  const page = mapIntroPageFromResponse(data);
  return <BrowserCmsContent content={page.mdx} />;
}
