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

export function getTags() {
  try {
    const tags = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      selectMany((item) => item.tags || []),
      distinct(),
      toArray()
    );

    return tags;
  } catch {
    throw new TagDataError();
  }
}

export function getPostsWithTag(tag?: string) {
  if (!tag) {
    throw new TagNotProvidedError();
  }

  try {
    const posts = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      where((item) => item.tags && item.tags.includes(tag)),
      distinct(),
      toArray()
    );

    if (!posts.length) {
      throw new TagNotFoundError(tag);
    }

    return posts;
  } catch {
    throw new TagDataError();
  }
}

export class TagNotFoundError extends Response {
  constructor(tag: string) {
    super(null, {
      status: 404,
      statusText: `Tag "${tag}" not found`,
    });
  }
}

export class TagNotProvidedError extends Response {
  constructor() {
    super(null, {
      status: 400,
      statusText: 'Tag not provided',
    });
  }
}

export class TagDataError extends Response {
  constructor() {
    super(null, {
      status: 500,
      statusText: 'Failed to load tag data',
    });
  }
}
