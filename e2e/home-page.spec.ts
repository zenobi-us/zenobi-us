import { test } from '@playwright/test';

test.describe('HomePage', () => {
  test('It contains the logo', async ({ page }) => {
    await page.goto('');
    await page.getByRole('img', { name: 'home-avatar' });
    await page.getByTestId('avatar');
    await page.getByTestId('home-avatar');
  });
});
