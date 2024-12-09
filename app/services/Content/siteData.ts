import { firstOrNull, from, query } from 'linq-functional';

import { allSiteData } from 'content-collections';

import { whereIdEquals } from './selectors';

export async function getSiteData() {
  try {
    const data = query(from(allSiteData), whereIdEquals('main'), firstOrNull());
    return data;
  } catch (error) {
    console.error('Failed to load site data', error);
    throw new Error('Failed to load site data');
  }
}

export async function getFooterData() {
  try {
    const items = allSiteData;

    const footer = query(from(items), whereIdEquals('footer'), firstOrNull());
    return Response.json(footer);
  } catch (error) {
    console.error('Failed to load footer data', error);
    throw new Error('Failed to load footer data');
  }
}
