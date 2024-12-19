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
    return posts;
  } catch (error) {
    console.error('Failed to load posts data', error);
    throw new Error('Failed to load posts data');
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
      throw new Response('', { status: 404 });
    }

    return post;
  } catch (error) {
    const message = `Failed to load post[id="${id}"] data`;
    console.error(message, error);
    throw new Error(message);
  }
}
