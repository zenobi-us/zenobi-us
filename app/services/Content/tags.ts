import {
  distinct,
  from,
  query,
  where,
  selectMany,
  toArray,
} from 'linq-functional';

import { allPosts, type Post } from 'content-collections';

import { whereDraftOnlyInDevelopment } from './selectors';

export async function getTags() {
  try {
    const tags = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      selectMany((item) => item.tags || []),
      distinct(),
      toArray()
    );

    return tags;
  } catch (error) {
    console.error('Failed to load tags data', error);
    throw new Error('Failed to load tags data');
  }
}

export async function getPostsWithTag(tag: string) {
  try {
    const posts = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      where((item) => item.tags && item.tags.includes(tag)),
      distinct(),
      toArray()
    );

    return posts;
  } catch (error) {
    console.error('Failed to load tag data', error);
    throw new Error('Failed to load tag data');
  }
}
