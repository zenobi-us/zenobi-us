import { query, from, firstOrNull, toArray } from 'linq-functional';

import { allHelps, type Help } from 'content-collections';

import { onlyInDevelopment, whereIdEquals } from './selectors';

export function getHelpPage(id?: string) {
  try {
    const help = query(
      from(allHelps),
      onlyInDevelopment(),
      whereIdEquals<Help>(id),
      firstOrNull()
    );

    if (!help) {
      throw new HelpNotFoundError(id);
    }

    return help;
  } catch {
    throw new HelpsDataLoadError();
  }
}

export function getHelpPages() {
  try {
    const help = query(from(allHelps), onlyInDevelopment(), toArray<Help>());

    if (!help) {
      throw new Response('', { status: 404 });
    }

    return help;
  } catch {
    throw new HelpsDataLoadError();
  }
}

export class HelpNotFoundError extends Response {
  constructor(postid: string) {
    super('', {
      status: 404,
      statusText: `Help with id "${postid}" not found`,
    });
  }
}

export class HelpsDataLoadError extends Response {
  constructor() {
    super('', {
      status: 500,
      statusText: 'Failed to load help data',
    });
  }
}
