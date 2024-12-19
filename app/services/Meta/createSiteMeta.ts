import type { getSiteData } from '../Content/siteData';

type WithSiteData = {
  siteData: Omit<Awaited<ReturnType<typeof getSiteData>>, 'date'> & {
    date: Date | string;
  };
};

export function createSiteMeta<T extends WithSiteData>(data?: T) {
  return [
    { title: 'Zenobius' },
    { name: 'description', content: data?.siteData?.description || '' },
  ];
}
