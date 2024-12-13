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
import { AnimatePresence } from 'framer-motion';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { type ComponentProps } from 'react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { classnames } from '~/core/classnames';
import { getAppVersion, getFooterData } from '~/services/Content/siteData';
import { useRouteHandles } from '~/services/routeHandles';
import { LinkProvider } from '~/components/ds/link/LinkProvider';
import { NavigationProvider } from '~/components/common/GlobalNav/NavigationProvider';
import { Site } from '~/components/ds/sitelayout/Site';
import { GlobalNav } from '~/components/common/GlobalNav/GlobalNav';
import { GlobalFooter } from '~/components/common/GlobalFooter/GlobalFooter';
import { useDarkMode } from '~/services/Theme/Init';
import { useClientSideFaviconColourStorage } from '~/components/common/favicons/useClientSideFaviconColourStorage';
import { useClientSideFavicon } from '~/components/common/favicons/useClientSideFavicon';
import { Box } from '~/components/ds/box/Box';

import './theme/fonts/robotoslab';
import './main.css';
import { PopoverArrow, PopoverContent } from './components/ds/popover/Popover';

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
                <Site.Main>{outlet}</Site.Main>
              </AnimatePresence>

              {handles.globalFooter && data.footer?.mdx && (
                <Site.Footer>
                  <GlobalFooter content={data.footer.mdx}></GlobalFooter>
                </Site.Footer>
              )}
              <Box className="flex gap-2 justify-center p-4">
                <Tooltip
                  sideAlign="start"
                  side="bottom"
                  trigger={
                    <Box className="flex gap-2 text-text-muted text-xs">
                      <Box className="font-semibold">version</Box>
                      <Box>{data.version.version}</Box>
                    </Box>
                  }
                >
                  <Box className="flex flex-col gap-2 divide-y-2 divide-dotted divide-opacity-80 divide-border-informative">
                    <Box className="flex gap-2 items-center">
                      <GitHubLogoIcon />
                      <Box className="font-semibold">zenobi-us/zenobi-us</Box>
                    </Box>
                    <Box className="flex flex-col gap-2 pt-2">
                      <Box className="flex gap-2">
                        <Box className="font-semibold">hash</Box>
                        <Box asChild>
                          <a
                            className="text-link"
                            target="_blank"
                            href={`https://github.com/zenobi-us/zenobi-us/commit/${data.version.hash}`}
                            rel="noreferrer"
                          >
                            {data.version.hash}
                          </a>
                        </Box>
                      </Box>
                      <Box className="flex gap-2">
                        <Box className="font-semibold">branch</Box>
                        <Box asChild>
                          <a
                            className="text-link"
                            target="_blank"
                            href={`https://github.com/zenobi-us/zenobi-us/compare/${data.version.branchname}`}
                            rel="noreferrer"
                          >
                            {data.version.branchname}
                          </a>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Tooltip>
              </Box>
            </Site>
          </NavigationProvider>
        </LinkProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Tooltip({
  trigger,
  children,
  side,
  sideAlign,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
} & Pick<ComponentProps<typeof PopoverContent>, 'side' | 'sideAlign'>) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>

      <PopoverContent
        side={side}
        sideAlign={sideAlign}
        className={classnames(
          'flex flex-col justify-center gap-2',
          'border-border-informative',
          'bg-background-overlay',
          'text-text-hover',
          'rounded-md',
          'border-2'
        )}
      >
        <PopoverArrow />
        <Box className="flex flex-col gap-2">{children}</Box>
      </PopoverContent>
    </Popover>
  );
}
