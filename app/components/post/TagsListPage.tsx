import { $path } from 'remix-routes';
import { Link } from '@remix-run/react';

import { PostEnd } from '../common/PostEnd/PostEnd';
import { Page } from '../ds/page/Page';

export function TagsListPage({ tags }: { tags: string[] }) {
  return (
    <Page>
      <Page.Header title="All tags" />

      <Page.Block direction="column">
        <div className="flex flex-row flex-wrap gap-2 w-full">
          {tags.map((tag) => {
            return (
              <Link
                key={tag}
                className="text-text-link p-4"
                to={$path('/b/tags/:tag', { tag })}
              >
                {tag}
              </Link>
            );
          })}
        </div>
        <PostEnd />
      </Page.Block>
    </Page>
  );
}
