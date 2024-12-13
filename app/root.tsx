import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useMatches,
  useLocation,
  useLoaderData,
  Link,
  useOutlet,
  json,
} from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';

import { classnames } from '~/core/classnames';
import { getAppVersion, getFooterData } from '~/services/Content/siteData';
import { useRouteHandles } from '~/services/routeHandles';
import { useDarkMode } from '~/services/Theme/Init';
import { Box } from '~/components/ds/box/Box';
import { GlobalFooter } from '~/components/common/GlobalFooter/GlobalFooter';
import { GlobalNav } from '~/components/common/GlobalNav/GlobalNav';
import { LinkProvider } from '~/components/ds/link/LinkProvider';
import { NavigationProvider } from '~/components/common/GlobalNav/NavigationProvider';
import { Site } from '~/components/ds/sitelayout/Site';
import { useClientSideFavicon } from '~/components/common/favicons/useClientSideFavicon';
import { useClientSideFaviconColourStorage } from '~/components/common/favicons/useClientSideFaviconColourStorage';
import { DisplayVersion } from '~/components/common/DisplayVersion';
import { VersionTooltip } from '~/components/common/VersionTooltip';
import { Loader } from '~/components/ds/loader/Loader';

import './theme/fonts/robotoslab';
import './main.css';

export async function loader() {
  const footer = await getFooterData();
  const version = await getAppVersion();
  return json({
    footer,
    version,
  });
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

export default function App() {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? '/';
  const data = useLoaderData<typeof loader>();
  const storage = useClientSideFaviconColourStorage();
  const handles = useRouteHandles();
  const location = useLocation();
  const outlet = useOutlet();
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
      <body className="flex flex-col min-h-svh bg-background-modal">
        <AnimatePresence
          mode="popLayout"
          initial={false}
        >
          {darkmode.loading && (
            <motion.div
              className="flex flex-grow transform transition-opacity opacity-100"
              variants={{
                start: { opacity: 0 },
                end: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              transition={{ duration: 2 }}
              initial="start"
              animate="end"
              exit="exit"
            >
              <Loader
                label="Loading..."
                size="sm"
              />
            </motion.div>
          )}

          {!darkmode.loading && (
            <motion.div
              className={classnames(
                'flex flex-grow flex-col',
                'transform transition-opacity',
                darkmode.loading && 'opacity-0',
                !darkmode.loading && 'opacity-100'
              )}
              variants={{
                start: { opacity: 0 },
                end: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              transition={{ duration: 2 }}
              initial="start"
              animate="end"
              exit="exit"
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
                      <Site.Main>{outlet}</Site.Main>
                    </AnimatePresence>

                    {handles.globalFooter && data.footer?.mdx && (
                      <Site.Footer>
                        <GlobalFooter content={data.footer.mdx}></GlobalFooter>
                      </Site.Footer>
                    )}

                    <Box className="flex gap-2 justify-center p-4">
                      <VersionTooltip version={data.version}>
                        <DisplayVersion
                          version={data.version}
                          className="text-text-muted text-xs"
                        />
                      </VersionTooltip>
                    </Box>
                  </Site>
                </NavigationProvider>
              </LinkProvider>
            </motion.div>
          )}
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
