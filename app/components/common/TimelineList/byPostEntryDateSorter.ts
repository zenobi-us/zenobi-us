import sugar from 'sugar';

import { createDateSorter } from '~/core/dates/core-dates';

import type { Post } from 'content-collections';

export const byPostEntryDateSorter = createDateSorter<Post>((post) => {
  return sugar.Date.create(post.date || undefined);
}, 'asc');
