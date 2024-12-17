import { query, from, firstOrNull, toArray } from 'linq-functional';

import { allHelps, type Help } from 'content-collections';

import { onlyInDevelopment, whereIdEquals } from './selectors';

export async function getHelpPage(id?: string) {
  try {
    const help = await query(
      from(allHelps),
      onlyInDevelopment(),
      whereIdEquals<Help>(id),
      firstOrNull()
    );

    if (!help) {
      throw new Response('', { status: 404 });
    }

    return help;
  } catch (error) {
    const message = `Failed to load help[id="${id}"] data`;
    console.error(message, error);
    throw new Error(message);
  }
}

export async function getHelpPages() {
  try {
    const help = await query(
      from(allHelps),
      onlyInDevelopment(),
      toArray<Help>()
    );

    if (!help) {
      throw new Response('', { status: 404 });
    }

    return help;
  } catch (error) {
    console.error('Failed to load help data', error);
    throw new Error('Failed to load help data');
  }
}
