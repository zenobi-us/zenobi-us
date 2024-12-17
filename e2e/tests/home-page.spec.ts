import { test } from '@playwright/test';

import { waitForPage } from '../core/waitForPage';

test.describe('HomePage', () => {
  test('It contains the logo', async ({ page }) => {
    await waitForPage({ page, url: '' });

    await page.getByRole('img', { name: 'home-avatar' });
    await page.getByTestId('avatar');
    await page.getByTestId('home-avatar');
  });
});
