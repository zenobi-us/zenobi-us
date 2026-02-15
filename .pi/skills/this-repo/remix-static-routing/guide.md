# Remix Static Routing Guide

## Quick Start

### File Structure Overview

```
app/routes/
├── _landing._index/
│   └── route.tsx          # Landing page (/)
├── _landing/
│   └── layout.tsx         # Landing layout wrapper
├── b._index/
│   └── route.tsx          # Blog index (/b)
├── b.tags.$tag._index/
│   └── route.tsx          # Tagged posts (/b/tags/:tag)
├── b.$slug/
│   └── route.tsx          # Blog post detail (/b/:slug)
├── h._index/
│   └── route.tsx          # Help index (/h)
├── h.$slug/
│   └── route.tsx          # Help article detail (/h/:slug)
└── root.tsx               # Root layout (global)
```

## Creating Routes

### Basic Route Example

File: `app/routes/example/route.tsx`

```typescript
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Example Page' },
  { name: 'description', content: 'An example page' },
];

export default function Example() {
  return (
    <div>
      <h1>Example Page</h1>
    </div>
  );
}
```

**URL:** `/example`

### Dynamic Route Example

File: `app/routes/b.$slug/route.tsx`

```typescript
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

interface Post {
  slug: string;
  title: string;
  content: string;
}

export async function loader(args: LoaderFunctionArgs) {
  const { slug } = args.params;
  const post = await loadPost(slug);
  
  if (!post) {
    throw new Response('Not Found', { status: 404 });
  }
  
  return { post };
}

export const meta: MetaFunction<typeof loader> = (args) => [
  { title: args.data?.post.title },
];

export default function PostDetail() {
  const { post } = useLoaderData<typeof loader>();
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

**URL:** `/b/:slug` (e.g., `/b/my-blog-post`)

## Layout Groups

Layout groups use `_` prefix and don't affect the URL structure.

### Example: Landing Layout

File: `app/routes/_landing/layout.tsx`

```typescript
import { Outlet } from '@remix-run/react';

export default function LandingLayout() {
  return (
    <div className="landing-wrapper">
      <nav>
        {/* Landing-specific nav */}
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* Landing-specific footer */}
      </footer>
    </div>
  );
}
```

Then routes in `_landing` group inherit this layout:

- `app/routes/_landing._index/route.tsx` → `/` with landing layout
- `app/routes/_landing.about/route.tsx` → `/about` with landing layout

## Accessing URL Parameters

### In Loader

```typescript
export async function loader(args: LoaderFunctionArgs) {
  const { slug, tag } = args.params;
  // Use slug and tag to fetch data
}
```

### In Component

```typescript
import { useParams } from '@remix-run/react';

export default function MyRoute() {
  const { slug } = useParams();
  // Use slug in component
}
```

## Data Loading

### Loader Pattern

```typescript
export async function loader(args: LoaderFunctionArgs) {
  const data = await fetchSomeData();
  return json({ data });
}

export default function MyRoute() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{data}</div>;
}
```

### Error Handling

```typescript
export async function loader(args: LoaderFunctionArgs) {
  const item = await findItem(args.params.id);
  
  if (!item) {
    throw new Response('Not Found', { status: 404 });
  }
  
  return json({ item });
}
```

## Static Site Generation

### How It Works

The project uses `ssg-cli.ts` to:

1. **Crawl Routes** - Start from root and follow all links
2. **Render to HTML** - Pre-render each route to static HTML
3. **Output Files** - Generate `dist/` directory with `.html` files

### Making Routes Crawlable

For dynamic routes to be included in the static build:

1. **Discoverable from root** - Routes must be reachable by following links
2. **Return all IDs in index** - List pages should link to detail pages

Example:

```typescript
// app/routes/b._index/route.tsx
export async function loader() {
  const posts = await getAllPosts(); // Returns list with slugs
  return json({ posts });
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={`/b/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

This ensures `/b/:slug` routes are discovered and pre-rendered.

## SEO and Meta Tags

### Page Metadata

```typescript
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction<typeof loader> = (args) => [
  { title: `${args.data?.title} | My Site` },
  { name: 'description', content: args.data?.excerpt },
  { property: 'og:title', content: args.data?.title },
  { property: 'og:description', content: args.data?.excerpt },
];
```

The `meta` function receives loader data and returns an array of meta tags.

## Common Patterns

### Index Routes

Routes ending in `._index` serve as directory indexes:

- `app/routes/b._index/route.tsx` → `/b`
- `app/routes/h._index/route.tsx` → `/h`

### Nested Dynamic Segments

Multiple dynamic segments:

- `app/routes/b.tags.$tag._index/route.tsx` → `/b/tags/:tag`
- `app/routes/help.$section.$article/route.tsx` → `/help/:section/:article`

### Catch-All Routes

Use `$.tsx` for catch-all routes (not used in this project, but available).

## Building and Deploying

### Development

```bash
mise run dev
# Starts dev server with hot reload
# Visit http://localhost:5173
```

### Static Build

```bash
mise run build
# Generates static site in dist/
# Runs: typecheck → ssg-cli.ts
```

### Preview Built Site

```bash
mise run preview
# Serves built site for testing
```

## Debugging Routes

### Check Route Mapping

Routes follow a predictable pattern based on filenames:

| File Path | URL |
|-----------|-----|
| `_index/route.tsx` | `/` |
| `section._index/route.tsx` | `/section` |
| `section.$id/route.tsx` | `/section/:id` |
| `_layout/layout.tsx` | (layout, no URL) |

### Verify in Dev

1. Start dev server: `mise run dev`
2. Navigate to URLs and check browser DevTools
3. Check Network tab to see if routes load
4. Check Console for errors

### Test Static Build

1. Run build: `mise run build`
2. Check `dist/` directory for generated HTML
3. Preview: `mise run preview`
4. Verify all routes are present

## Tips & Best Practices

✓ **Do:**
- Keep routes focused and simple
- Use loaders for all data fetching
- Organize related routes in layout groups
- Test routes in static build before deploying
- Use semantic file names

✗ **Don't:**
- Fetch data in components (use loaders)
- Use default exports for non-route components
- Create routes that aren't discoverable from the index
- Hardcode paths (use `Link` and `useParams`)

## Troubleshooting

### Route Not Found

1. Check file path and naming conventions
2. Verify `$` and `_` prefixes are correct
3. Ensure file is in correct directory structure
4. Restart dev server

### Dynamic Routes Not in Static Build

1. Verify routes are linked from index pages
2. Check that all IDs are discoverable
3. Ensure loader returns all necessary data
4. Run build and check dist/ directory

### Data Not Loading

1. Check loader function exports
2. Verify loader data types match usage
3. Check Network tab for fetch errors
4. Look for 404 or 500 responses
