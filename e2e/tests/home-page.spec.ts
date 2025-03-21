import { test } from '@playwright/test';
import { $path } from 'remix-routes';

import { waitForPage } from '../core/waitForPage';

test.describe('HomePage', () => {
  test('It contains the logo', async ({ page }) => {
    await waitForPage({ page, pathname: $path('/') });

    await page.getByRole('img', { name: 'home-avatar' });
    await page.getByTestId('avatar');
    await page.getByTestId('home-avatar');
  });
});
