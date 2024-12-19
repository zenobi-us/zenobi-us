import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { BrowserCmsContent } from '~/components/common/cmscontent/CmsContent';
import { getIntro } from '~/services/Content/intros';
import { getSiteData } from '~/services/Content/siteData';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';

export async function loader() {
  const [intro, siteData] = await Promise.all([getIntro(), getSiteData()]);
  return Response.json({ intro, siteData });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...createSiteMeta(data)];
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  return <BrowserCmsContent content={data.intro.mdx} />;
}
