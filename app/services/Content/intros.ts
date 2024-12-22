import { firstOrNull, from, query } from 'linq-functional';

import { allSiteData, type SiteDatum } from 'content-collections';

import { whereIdEquals } from './selectors';

export function getIntro() {
  try {
    const id = 'intro';
    const intro = query(
      from(allSiteData),
      whereIdEquals<SiteDatum>(id),
      firstOrNull()
    );

    if (!intro) {
      throw new IntroNotFoundError();
    }

    return intro;
  } catch {
    throw new IntroLoadError();
  }
}

export class IntroNotFoundError extends Response {
  constructor() {
    super(null, { status: 404, statusText: 'Intro not found' });
  }
}

export class IntroLoadError extends Response {
  constructor() {
    super(null, { status: 500, statusText: 'Failed to load intro' });
  }
}
