import { from, query, toArray, firstOrNull } from 'linq-functional';

import { allPosts, type Post } from 'content-collections';

import { whereDraftOnlyInDevelopment, whereIdEquals } from './selectors';

export function getPosts() {
  try {
    const posts = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      toArray()
    );
    if (!posts) {
      throw new PostsDataLoadError();
    }

    return posts;
  } catch {
    throw new PostsDataLoadError();
  }
}

export function getPost(id?: string) {
  try {
    const post = query(
      from(allPosts),
      whereDraftOnlyInDevelopment<Post>(),
      whereIdEquals<Post>(id),
      firstOrNull()
    );

    if (!post) {
      throw new PostNotFoundError(id);
    }

    return post;
  } catch {
    throw new PostsDataLoadError();
  }
}

export class PostNotFoundError extends Response {
  constructor(id: string) {
    super('', {
      status: 404,
      statusText: `Post with id "${id}" not found`,
    });
  }
}

export class PostsDataLoadError extends Response {
  constructor() {
    super('', {
      status: 500,
      statusText: 'Failed to load posts data',
    });
  }
}
