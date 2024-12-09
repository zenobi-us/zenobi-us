import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useLocation,
  useLoaderData,
  Link,
} from '@remix-run/react';
import { AnimatePresence } from 'framer-motion';

import { classnames } from '~/core/classnames';
import { getFooterData } from '~/services/Content/siteData';
import { useRouteHandles } from '~/services/routeHandles';
import { LinkProvider } from '~/components/ds/link/LinkProvider';
import { NavigationProvider } from '~/components/common/GlobalNav/NavigationProvider';
import { Site } from '~/components/ds/sitelayout/Site';
import { GlobalNav } from '~/components/common/GlobalNav/GlobalNav';
import { GlobalFooter } from '~/components/common/GlobalFooter/GlobalFooter';
import { useDarkMode } from '~/services/Theme/Init';
import { useClientSideFaviconColourStorage } from '~/components/common/favicons/useClientSideFaviconColourStorage';
import { useClientSideFavicon } from '~/components/common/favicons/useClientSideFavicon';

import './theme/fonts/robotoslab';
import './main.css';
import { ContactFormDrawer } from './components/common/GlobalFooter/ContactFormDrawer';

export async function loader() {
  return getFooterData();
}

function LinkInterop({
  href,
  ...props
}: { href: string } & React.ComponentProps<'a'>) {
  return (
    <Link
      to={href}
      {...props}
    />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? '/';
  const data = useLoaderData<typeof loader>();
  const storage = useClientSideFaviconColourStorage();
  const handles = useRouteHandles();
  const location = useLocation();

  const darkmode = useDarkMode((theme) => {
    console.log(`root: Theme changed ${theme}`);
  });

  useClientSideFavicon(storage.value);

  return (
    <html
      lang="en"
      className="flex flex-col min-h-svh light"
    >
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon-16.ico"
        />
        <link
          rel="icon"
          href="/favicon-32.ico"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
        <link
          rel="manifest"
          href="/manifest.webmanifest"
        />
        <Links />
      </head>
      <body
        className={classnames(
          darkmode.loading && 'hidden',
          !darkmode.loading && 'flex flex-col min-h-svh'
        )}
      >
        <LinkProvider component={LinkInterop}>
          <NavigationProvider currentPath={currentPath}>
            <Site pathId={location.pathname}>
              {handles.globalNav && (
                <Site.Header>
                  <GlobalNav
                    useLogo
                    currentPath={currentPath}
                  />
                </Site.Header>
              )}

              <AnimatePresence
                initial={false}
                mode="wait"
              >
                <Site.Main>{children}</Site.Main>
              </AnimatePresence>

              {handles.globalFooter && data?.mdx && (
                <Site.Footer>
                  <GlobalFooter content={data.mdx}>
                    <ContactFormDrawer />
                  </GlobalFooter>
                </Site.Footer>
              )}
            </Site>
          </NavigationProvider>
        </LinkProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
