import { expect, type Page } from '@playwright/test';

export async function waitForPage({
  page,
  pathname,
}: {
  page: Page;
  pathname: string;
}) {
  await page.goto(pathname);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.getByTestId('site')).toBeVisible();
}
