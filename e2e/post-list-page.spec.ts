import { test, expect } from '@playwright/test';

test.describe('PostList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/b');
  });

  test('The page contains a list of posts sorted by year then day', async ({
    page,
  }) => {
    expect(await page.getByRole('heading', { name: 'Thoughts' }));
    await page.getByTestId('timeline-list');
    await page.getByTestId('timeline-list-year-2024');
    const header = await page.getByTestId('timeline-list-year-2024-header');
    await expect(header).toHaveText('2024');
  });
});
