import * as superjson from 'superjson';
import type { Post } from 'content-collections';

import { Page } from '~/components/ds/page/Page';
import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { BlogPostTimelineList } from '~/components/post/BlogPostTimelineList';

export function mapDbPosts(posts: Post[]) {
  return posts.map((post) => ({
    date: post.date,
    title: post.title,
    tags: post.tags,
    stage: post.stage,
    _meta: {
      slug: post._meta.slug,
      id: post._meta.id,
    },
  }));
}

export function mapPostListToResponse(posts: Post[]) {
  return superjson.stringify(mapDbPosts(posts));
}

export type PostSummaryList = ReturnType<typeof mapDbPosts>;
export type PostSummary = PostSummaryList[number];

export function mapPostListFromResponse(
  posts: ReturnType<typeof mapPostListToResponse>
) {
  return superjson.parse<PostSummaryList>(posts);
}

export function PostListPage({ posts }: { posts: PostSummaryList }) {
  return (
    <Page>
      <Page.Block direction="column">
        <BlogPostTimelineList posts={posts} />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
