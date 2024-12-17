import { test, expect } from '@playwright/test';

import { formatPageHeaderDate } from '../app/components/ds/page/PageHeader';
import { allPosts } from 'content-collections';

test.describe('PostList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/b');
  });

  allPosts.forEach((post) =>
    test(`Test page: ${post._meta.id}`, async ({ page }) => {
      await expect(page.getByRole('heading', { name: post.title }));
      await expect(page.getByTestId('page-header-date')).toContainText(
        formatPageHeaderDate(post.date)
      );
    })
  );
});
