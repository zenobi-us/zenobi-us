import { test, expect } from '@playwright/test';
import { $path } from 'remix-routes';

import { formatPageHeaderDate } from '../../app/components/ds/page/PageHeader';
import { getPosts } from '../../app/services/Content/posts';

test.describe('PostList', async () => {
  getPosts().forEach((post) =>
    test(
      `Test page: ${post._meta.id}`,
      {
        annotation: [
          {
            type: 'environment',
            description: 'dev',
          },
        ],
      },
      async ({ page }) => {
        await page.goto($path('/b/:slug', { slug: post._meta.id }));
        await expect(page.getByTestId('site')).toBeVisible();

        await page.getByRole('heading', { name: post.title });
        await expect(page.getByTestId('page-header-date')).toContainText(
          formatPageHeaderDate(post.date)
        );
      }
    )
  );
});
