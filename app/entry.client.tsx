/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { InitialiseColorScheme } from './services/Theme/Init';

// @ts-expect-error - URL is defined in the context
const initialPathname = window.__remixContext.url;
const hydratedPathname = window.location.pathname;

/**
 * Fix initial pathname to match browser if we're dealing with trailing slashes.
 */
if (
  typeof initialPathname !== 'undefined' &&
  initialPathname !== hydratedPathname &&
  initialPathname.replace(/\/+$/, '') === hydratedPathname.replace(/\/+$/, '')
) {
  // @ts-expect-error - URL is defined in the context
  window.__remixContext.url = hydratedPathname;
}

startTransition(() => {
  InitialiseColorScheme((theme) => {
    console.log(`entry.client: Theme changed ${theme}`);
  });
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
