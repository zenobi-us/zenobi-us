import { test, expect } from '@playwright/test';

import routes from '../../dist/routes.json' with { type: "json" };
import { waitForPage } from '../core/waitForPage';

test.describe('ContactForm', () => {
  (routes as string[]).forEach((pathname) => {
    test(`A "Contact Me" button exists on: ${pathname}` , async ({ page }) => {
      await waitForPage({ page, pathname });
      expect(await page.getByRole('button', { name: 'Contact Me' }));
    });

    test(`A "Contact Me" button opens a contact form on: ${pathname}` , async ({ page }) => {
      await waitForPage({ page, pathname });
      await page.getByRole('button', { name: 'Contact Me' }).click();
      expect(await page.getByRole('dialog'));
    });

    test(`A "Contact Me" button closes a contact form on: ${pathname}` , async ({ page }) => {
      await waitForPage({ page, pathname });
      await page.getByRole('button', { name: 'Contact Me' }).click();
      await page.getByTestId('drawer-overlay').click();
      expect(await page.locator('[role="dialog"]').count()).toBe(0);
    })
  });
});
