import { firstOrNull, from, query } from 'linq-functional';

import { allSiteData, type SiteDatum } from 'content-collections';

import { whereIdEquals } from './selectors';

export async function getIntro() {
  try {
    const id = 'intro';
    const intro = query(
      from(allSiteData),
      whereIdEquals<SiteDatum>(id),
      firstOrNull()
    );

    return intro;
  } catch (error) {
    console.error('Failed to load intro data', error);
    throw new Error('Failed to load intro data');
  }
}
