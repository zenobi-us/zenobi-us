import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';
import lodash from 'lodash';
import fs from 'fs';
import { join } from 'path';
import match from 'micromatch';

import { mdxOptions } from './app/services/Content/mdx';

/**
 * Hack Predicate to override aggressive generics
 * done by content-collections/core
 */
function isDocumentWithContent<
  T extends { title: string; content: string }
>(document?: { content?: unknown; title?: unknown }): document is T {
  return (
    !!document &&
    typeof document.content === 'string' &&
    document.content.length > 0 &&
    typeof document.title === 'string' &&
    document.title.length > 0
  );
}

function getFsModifiedDate(filePath: string) {
  const stats = fs.statSync(filePath);
  return stats.mtime;
}

function getDocumentDate(document) {
  const date = document.date;

  return !date
    ? getFsModifiedDate(join('content', document._meta.filePath))
    : new Date(date);
}

function assert(condition?: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function documentSlug(filepath: string) {
  return lodash.kebabCase(filepath.replace('.md', ''));
}

/**
 * A Higher Order Function that accepts a collection of globs
 * and runs the provided function with a collection of heplper functions
 */
function normalisedCollection<T extends { glob: string; prefix: string }, R>(
  globArray: T[],
  fn: (
    globs: T['glob'][],
    helpers: {
      prefix: (path: string) => string;
      withOutPrefix: (path: string) => string;
    }
  ) => R
): R {
  const globs = globArray.map((item) => item.glob);
  const matchers = globArray.map((item) => ({
    prefix: item.prefix,
    matcher: match.matcher(item.glob),
  }));

  const prefix = (path: string) => {
    const matched = matchers.find((matcher) => matcher.matcher(path));
    if (!matched) {
      throw new Error(`No matching prefix found for ${path}`);
    }

    return matched.prefix;
  };

  const withOutPrefix = (path: string) => {
    const matched = matchers.find((matcher) => matcher.matcher(path));

    if (!matched) {
      throw new Error(`No matching prefix found for ${path}`);
    }

    return path.replace(matched.prefix, '');
  };

  return fn(globs, { prefix, withOutPrefix });
}

// Define schemas using Zod
const meSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
  content: z.string().default(''),
});

const siteDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  content: z.string().default(''),
});

const helpSchema = z.object({
  title: z.string(),
  date: z.string().optional().default(''),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  content: z.string().default(''),
});

const postsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  stage: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  banner: z
    .object({
      src: z.string(),
      credit: z.string().optional(),
    })
    .optional(),
  template: z.enum(['article', 'summary', 'link']).default('article'),
  tags: z.array(z.string()).default([]),
  content: z.string().default(''),
});

const me = normalisedCollection(
  [
    { prefix: '', glob: 'me/**/*.md' },
    { prefix: 'private', glob: 'private/me/**/*.md' },
  ],
  (globs, normalise) => {
    return defineCollection({
      name: 'me',
      directory: 'content',
      include: globs,
      schema: meSchema,
      transform: async (document, context) => {
        assert(
          isDocumentWithContent(document),
          `[${document._meta.filePath}] Document has no content`
        );
        const mdx = await compileMDX(context, document, mdxOptions());
        const date = getDocumentDate(document);
        return {
          ...document,
          mdx,
          date,
          _meta: {
            ...document._meta,
            slug: documentSlug(
              normalise.withOutPrefix(document._meta.filePath)
            ),
            id: documentSlug(document._meta.fileName),
          },
        };
      },
    });
  }
);

const siteData = normalisedCollection(
  [
    { prefix: '', glob: 'sitedata/**/*.md' },
    { prefix: 'private/', glob: 'private/sitedata/**/*.md' },
  ],
  (globs, normalise) => {
    return defineCollection({
      name: 'siteData',
      directory: 'content',
      include: globs,
      schema: siteDataSchema,
      transform: async (document, context) => {
        assert(
          isDocumentWithContent(document),
          `[${document._meta.filePath}] Document has no content`
        );
        const mdx = await compileMDX(context, document, mdxOptions());

        const date = getDocumentDate(document);
        return {
          ...document,
          mdx,
          date,
          _meta: {
            ...document._meta,
            slug: documentSlug(
              normalise.withOutPrefix(document._meta.filePath)
            ),
            id: documentSlug(document._meta.fileName),
          },
        };
      },
    });
  }
);

const help = normalisedCollection(
  [
    { prefix: '', glob: 'help/**/*.md' },
    { prefix: 'private/', glob: 'private/help/**/*.md' },
  ],
  (globs, normalise) =>
    defineCollection({
      name: 'help',
      directory: 'content',
      include: globs,
      schema: helpSchema,
      transform: async (document, context) => {
        assert(
          isDocumentWithContent(document),
          `[${document._meta.filePath}] Document has no content`
        );
        const mdx = await compileMDX(context, document, mdxOptions());
        const date = getDocumentDate(document);
        const tags = document.tags || [];
        return {
          ...document,
          mdx,
          date,
          tags,
          _meta: {
            ...document._meta,
            slug: documentSlug(
              normalise.withOutPrefix(document._meta.filePath)
            ),
            id: documentSlug(document._meta.fileName),
          },
        };
      },
    })
);

const posts = normalisedCollection(
  [
    { prefix: '', glob: 'posts/**/*.md' },
    { prefix: 'private/', glob: 'private/posts/**/*.md' },
  ],
  (globs, normalise) => {
    return defineCollection({
      name: 'posts',
      directory: 'content/',
      include: globs,
      schema: postsSchema,
      transform: async (document, context) => {
        assert(
          isDocumentWithContent(document),
          `[${document._meta.filePath}] Document has no content`
        );
        const mdx = await compileMDX(context, document, mdxOptions());
        const date = getDocumentDate(document);
        return {
          ...document,
          mdx,
          date,
          _meta: {
            ...document._meta,
            slug: documentSlug(
              normalise.withOutPrefix(document._meta.filePath)
            ),
            id: documentSlug(document._meta.fileName),
          },
        };
      },
    });
  }
);

export default defineConfig({
  collections: [posts, me, help, siteData],
});
