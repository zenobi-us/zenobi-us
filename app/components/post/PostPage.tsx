import * as superjson from 'superjson';

import type { Post } from 'content-collections';
import { Page } from '../ds/page/Page';
import { BrowserCmsContent } from '../common/cmscontent/CmsContent';
import { PostEnd } from '../common/PostEnd/PostEnd';

export function mapDbPost(post: Post) {
  return {
    date: post.date,
    title: post.title,
    tags: post.tags,
    mdx: post.mdx,
    banner: post.banner,
    _meta: {
      slug: post._meta.slug,
      id: post._meta.id,
    },
  };
}

export function mapPostDetailToResponse(post: Post) {
  return superjson.stringify(mapDbPost(post));
}

export type PostDetail = ReturnType<typeof mapDbPost>;

export function mapPostFromResponse(
  post: ReturnType<typeof mapPostDetailToResponse>
) {
  return superjson.parse<PostDetail>(post);
}

export function PostPage({ post }: { post: PostDetail }) {
  return (
    <Page>
      {post.banner && (
        <Page.Banner
          src={post.banner.src}
          credit={post.banner?.credit}
        />
      )}
      <Page.Header title={post.title}>
        <div className="inline-flex flex-wrap items-center gap-2">
          <Page.Header.Date date={post.date} />
          <Page.Header.Tags tags={post.tags} />
        </div>
      </Page.Header>
      <Page.Block direction="column">
        <BrowserCmsContent
          content={post.mdx}
          className="prose-base"
        />
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
