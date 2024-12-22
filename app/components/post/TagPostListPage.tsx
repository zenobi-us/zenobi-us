import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { $path } from 'remix-routes';

import { PostEnd } from '~/components/common/PostEnd/PostEnd';
import { Page } from '~/components/ds/page';
import { BlogPostTimelineList } from '~/components/post/BlogPostTimelineList';
import type { PostSummaryList } from '~/components/post/PostListPage';
import { Tag } from '~/components/post/Tag';

export function TagPostListPage({
  tag,
  posts,
}: {
  tag: string;
  posts: PostSummaryList;
}) {
  return (
    <Page>
      <Page.Header title={`Posts tagged with "${tag}"`}>
        <div className="flex flex-row gap-4">
          <Tag
            icon={<ArrowLeftIcon />}
            label="Return to Posts"
            href={$path('/b')}
          />
          <Tag
            icon={<ArrowLeftIcon />}
            label="All Tags"
            href={$path('/b/tags')}
          />
        </div>
      </Page.Header>

      <Page.Block direction="column">
        <div className="flex flex-row gap-4">
          <BlogPostTimelineList posts={posts} />
        </div>
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
