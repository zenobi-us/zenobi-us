import path from 'node:path';
import { createRequestHandler } from '@remix-run/server-runtime';
import fse from 'fs-extra';
import { parse } from 'node-html-parser';
import invariant from 'tiny-invariant';
import type { ServerBuild } from '@remix-run/node';
import nconf from 'nconf';
import { z } from 'zod';
import chalk from 'chalk';

function ArgParser() {
  const schema = z
    .object({
      build: z
        .string()
        .default('build/server')
        .transform((value) => {
          const resolved = path.resolve(value);
          // is the resolve path a directory?
          // if so, we should add index.js
          if (
            fse.existsSync(resolved) &&
            fse.statSync(resolved).isDirectory()
          ) {
            return path.join(resolved, 'index.js');
          }
          return resolved;
        }),
      output: z
        .string()
        .default('build/client')
        .transform((value) => {
          return path.resolve(value);
        }),
      basename: z.string().optional(),
      discover: z
        .union([
          z.literal('true').transform(() => true),
          z.literal('false').transform(() => false),
          z.null().transform(() => true),
        ])
        .default('false'),
    })
    .strict();

  const config = nconf.argv().env({
    lowerCase: true,
    whitelist: Object.keys(schema.shape).map(
      (key) => `ssg_${key.toLowerCase()}`
    ),
  });

  const { _, $0, ...values } = config.get();

  return schema.parse(values);
}

function Info(prefix: string, message: string) {
  return chalk`{blue ℹ️ ${prefix}} {white ${message}}`;
}
function Warning(prefix: string, message: string) {
  return chalk`{yellow ⚠️ ${prefix}} {white ${message}}`;
}
function Error(prefix: string, message: string) {
  return chalk`{red ⁉️ ${prefix}} {white ${message}}`;
}
function Success(prefix: string, message: string) {
  return chalk`{green ✔️ ${prefix}} {white ${message}}`;
}
function Fatal(prefix: string, message: string) {
  return chalk`{red 🔥 ${prefix}} {white ${message}}`;
}

/**
 * A set of paths that have been seen
 * We don't care about the order of the paths, just that they have been seen
 */
type SeenPaths = Set<string>;

function PreparePathName(pathname: string) {
  // Crawl with a trailing slash to avoid hydration issues
  if (!pathname.endsWith('/')) {
    pathname = pathname + '/';
  }

  return pathname;
}

/**
 * Generate a file writer that writes a rendered document or data to a file
 */
async function CreateFileWriter({
  createFileName,
}: {
  createFileName: (pathname: string) => string;
}) {
  return async function WriteRenderedDocumentToFile(
    pathname: string,
    content: string
  ) {
    const outputPath = createFileName(pathname);
    console.group(Info('WRITE', `Writing ${pathname} to ${outputPath}`));
    try {
      await fse.outputFile(outputPath, content);
      console.log(Success('WRITE', `Done.`));
      console.groupEnd();
    } catch (error) {
      console.error(Error('WRITE', 'Failed'), error);
      console.groupEnd();
    }
  };
}
type FileWriter = Awaited<ReturnType<typeof CreateFileWriter>>;

/**
 * Create a file fetcher that fetches a file from the server
 *
 * the request path is formatted by the formatRequestPath function
 */
async function CreateFileFetcher({
  requestHandler,
  formatRequestPath,
}: {
  requestHandler: ReturnType<typeof createRequestHandler>;
  formatRequestPath: (pathname: string) => string;
}) {
  return async function (
    pathname: string
  ): Promise<{ content: string; requestPath: string }> {
    let request: Request | null = null;
    let response: Response | null = null;
    let requestPath: string;

    try {
      requestPath = formatRequestPath(pathname);
    } catch (error) {
      console.error(`Failed to format request path for ${pathname}`, error);
      return { content: '', requestPath: '' };
    }

    console.group(Info('FETCH', `Requesting ${requestPath} from the server`));
    try {
      // localhost here is a placeholder, we are not actually making a network request
      request = new Request(`http://localhost${requestPath}`);
      response = await requestHandler(request);
      console.groupEnd();
    } catch (error) {
      console.error(
        Error('FETCH', `Failed to fetch ${requestPath} from the server`),
        error
      );
      console.groupEnd();
      return { content: '', requestPath };
    }

    if (!response.ok) {
      console.error(
        Error(
          'FETCH',
          `Failed to fetch ${requestPath} from the server. Status: ${response.status}`
        )
      );
      console.groupEnd();
      return { content: '', requestPath };
    }

    const content = await response.text();
    console.log(
      Success('FETCH', `Fetched ${requestPath} from the server successfully`)
    );
    return { content, requestPath };
  };
}

type FileFetcher = Awaited<ReturnType<typeof CreateFileFetcher>>;
/**
 * Create a link sniffer that sniffs internal links from a document.
 *
 * Used to find internal links in a document that have not been crawled yet.
 */
function CreateLinkSniffer({
  crawled,
  queued,
}: {
  crawled: SeenPaths;
  queued: string[];
}) {
  return async function GetInteralSiteLinksFromDocument(
    document: ReturnType<typeof parse>
  ) {
    const output: string[] = [];

    if (!document) {
      return output;
    }
    const links = document.querySelectorAll('a');
    console.log(
      Success('SNIFF', `Found ${links.length} link(s) in the document`)
    );

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) {
        continue;
      }
      if (!href.startsWith('/')) {
        continue;
      }

      if (crawled.has(href)) {
        continue;
      }

      if (queued.includes(href)) {
        continue;
      }

      output.push(href);
    }
    return output;
  };
}

/*
 * Create a link crawler that crawls a link and its internal links.

This performs the main work of the static site generator.
 */
function CreateLinkCrawler({
  queuedLinks,
  isSingleFetch,
  pageFetcher,
  pageWriter,
  dataFetcher,
  dataWriter,
}: {
  queuedLinks: string[];
  isSingleFetch?: boolean;
  pageFetcher: FileFetcher;
  dataFetcher: FileFetcher;
  pageWriter: FileWriter;
  dataWriter: FileWriter;
}) {
  const crawled: SeenPaths = new Set();
  const sniffer = CreateLinkSniffer({
    crawled,
    queued: queuedLinks,
  });

  return async function CrawlLink(pathname: string) {
    invariant(
      pathname.startsWith('/'),
      Fatal('CRAWL', 'Pathname must start with /')
    );

    // we dont need to crawl the same link twice
    if (crawled.has(pathname)) {
      return;
    }

    console.group(Info('CRAWL', `Crawling ${pathname}`));
    const document = await pageFetcher(pathname);

    if (!document) {
      console.groupEnd();
      crawled.add(pathname);
      return;
    }

    await pageWriter(pathname, document.content);

    if (isSingleFetch) {
      console.log(Info('CRAWL', 'Single fetch mode enabled, fetching data'));
      const documentData = await dataFetcher(pathname);
      await dataWriter(documentData.requestPath, documentData.content);
    }

    // Queue document internal links
    const internalLinks = await sniffer(parse(document.content));

    if (internalLinks.length === 0) {
      console.groupEnd();
      console.log(Warning('CRAWL', `No internal links found in ${pathname}`));
      crawled.add(pathname);
      return;
    }

    crawled.add(pathname);

    console.groupEnd();
    console.log(
      Success('CRAWL', `Found ${internalLinks.length} internal link(s)`)
    );

    internalLinks.forEach((link) => {
      queuedLinks.push(link);
    });
  };
}

/**
 * Initialize and provide a  static site generator renderer function
 */
async function SsgSiteRenderer(
  remixServer: ServerBuild,
  options: ReturnType<typeof ArgParser>
) {
  const requestHandler = createRequestHandler(remixServer, 'production');
  const isSingleFetch = !!remixServer.future.v3_singleFetch;

  const pageFetcher = await CreateFileFetcher({
    requestHandler,
    formatRequestPath: (pathname) => pathname,
  });
  const pageWriter = await CreateFileWriter({
    createFileName: (pathname) => {
      return path.join(options.output, pathname, 'index.html');
    },
  });

  const dataFetcher = await CreateFileFetcher({
    requestHandler,
    formatRequestPath: (pathname) => {
      return pathname === '/'
        ? '/_root.data'
        : `${pathname.replace(/\/$/, '')}.data`;
    },
  });
  const dataWriter = await CreateFileWriter({
    createFileName: (pathname) => {
      return path.join(options.output, pathname);
    },
  });

  return async (routes: string[]) => {
    console.log(
      Info('SSG', `Processing ${routes.length} route(s) to ${options.output}`)
    );

    await dataWriter('routes.json', JSON.stringify(routes, null, 2));

    const queuedLinks: string[] = Array.from(routes);

    const crawler = CreateLinkCrawler({
      queuedLinks,
      pageFetcher,
      pageWriter,
      dataFetcher,
      dataWriter,
      isSingleFetch,
    });

    while (queuedLinks.length > 0) {
      const href = queuedLinks.shift();
      if (!href) {
        break;
      }

      const pathname = PreparePathName(href);

      console.group(
        Info('SSG', `Processing ${pathname} (${queuedLinks.length} left)`)
      );

      await crawler(pathname);
      console.groupEnd();
    }

    return;
  };
}

/**
 * Predicates
 */

/**
 * Check if a module has a getStaticPaths function
 */
function isModuleWithStaticPaths(
  module: unknown
): module is { getStaticPaths: () => Promise<string[]> } {
  if (!module) {
    return false;
  }

  if (typeof module !== 'object') {
    return false;
  }

  if (!('getStaticPaths' in module)) {
    return false;
  }

  return typeof module.getStaticPaths === 'function';
}

/**
 * Check if a module has a path property
 */
function isModuleWithPath(module: unknown): module is { path: string } {
  if (!module) {
    return false;
  }

  if (typeof module !== 'object') {
    return false;
  }

  if (!('path' in module)) {
    return false;
  }

  return typeof module.path === 'string';
}

function isModulePathParameterised(path: string): boolean {
  return path.includes(':');
}

function buildRoutePath(
  route: ServerBuild['routes'][number],
  routes: ServerBuild['routes']
): string {
  if (route.parentId) {
    const parent = routes[route.parentId];
    return [buildRoutePath(parent, routes), route.path].join('/');
  }
  return route.path || '';
}

/**
 * Discover static paths from a Remix server build
 *
 * This function will crawl the server build and execute any getStaticPaths functions.
 *
 * If you discover that discovered links in generated pages are not covering all
 * the pages you expect, you may need to add a getStaticPaths function to your routes.
 */
async function AccumulateRoutes(
  routes: ServerBuild['routes'],
  options: ReturnType<typeof ArgParser>
) {
  const output: string[] = [];
  const accumulated: Promise<string[]>[] = [];

  console.group(
    Info('DISCOVER', 'Discovering static paths from Remix server build')
  );

  for (const [, route] of Object.entries(routes)) {
    console.group(
      Info('DISCOVER', `Checking route ${route.path} (${route.id})`)
    );
    const routePath = buildRoutePath(route, routes);

    if (
      isModuleWithPath(route) &&
      isModulePathParameterised(route.path) &&
      !isModuleWithStaticPaths(route.module)
    ) {
      console.log(
        Warning(
          'DISCOVER',
          `Skipping route ${routePath} (${route.id}) as it is parameterised. Export getStaticPaths in your route module to generate static paths.`
        )
      );
      continue;
    }

    if (isModuleWithPath(route) && !isModulePathParameterised(route.path)) {
      output.push(routePath.startsWith('/') ? routePath : `/${routePath}`);
      console.log(
        Success('DISCOVER', `Discovered route ${routePath} (${route.id})`)
      );
    }

    if (isModuleWithStaticPaths(route.module)) {
      try {
        const staticRoutes = route.module.getStaticPaths();
        accumulated.push(staticRoutes);
        console.log(
          Success('DISCOVER', `Discovered getStaticPaths in ${routePath}`)
        );
      } catch (error) {
        console.error(
          Error('DISCOVER', `Failed to execute getStaticPaths in ${routePath}`),
          error
        );
      }
    }

    console.groupEnd();
  }

  await Promise.all(accumulated).then((results) => {
    const staticPaths = results.flat();
    if (!staticPaths) {
      return;
    }

    if (!Array.isArray(staticPaths)) {
      return;
    }

    for (const path of staticPaths) {
      if (!path || typeof path !== 'string') {
        continue;
      }

      if (options.basename) {
        output.push(options.basename + path.replace(/^\//, ''));
      } else {
        output.push(path);
      }
    }
  });

  if (output.length === 0) {
    console.log(
      Warning(
        'DISCOVER',
        'No static paths discovered. Ensure you have a getStaticPaths function in your routes.'
      )
    );
  } else {
    console.log(
      Success('DISCOVER', `Discovered ${output.length} static path(s)`)
    );
  }

  return output;
}

async function main() {
  const options = ArgParser();
  const remixServer = await import(options.build);

  const renderer = await SsgSiteRenderer(remixServer, options);
  const paths = await AccumulateRoutes(remixServer.routes, options);
  await renderer(paths);
}

main();
