import { expect, type Page } from '@playwright/test';
import { RouteId, RoutesWithParams } from 'remix-routes';

export async function waitForPage<TRouteId extends RouteId>({
  page,
  url,
}: {
  page: Page;
  url: RouteId;
  params?: Record<string, string>;
}) {
  await page.goto(url);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.getByTestId('site')).toBeVisible();
}
