import { test, expect } from '@playwright/test';
import { $path } from 'remix-routes';

import { waitForPage } from '../core/waitForPage';

test.describe('PostList', () => {
  test('The page contains a list of posts sorted by year then day', async ({
    page,
  }) => {
    await waitForPage({ page, pathname: $path('/b') });

    expect(await page.getByRole('heading', { name: 'Thoughts' }));

    await page.getByTestId('timeline-list');
    await page.getByTestId('timeline-list-year-2024');
    const header = await page.getByTestId('timeline-list-year-2024-header');
    await expect(header).toHaveText('2024');
  });
});
