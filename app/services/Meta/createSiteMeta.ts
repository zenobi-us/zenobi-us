import type { getSiteData } from '../Content/siteData';

type WithSiteData = {
  siteData: Awaited<ReturnType<typeof getSiteData>>;
};

export function createSiteMeta<T extends WithSiteData>(data?: T) {
  return [
    { title: 'Zenobius' },
    { name: 'description', content: data?.siteData?.description || '' },
  ];
}
