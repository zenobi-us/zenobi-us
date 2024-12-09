import type { Meta } from '@content-collections/core';
import { where, query, intersect, count, from } from 'linq-functional';

export const whereDraftOnlyInDevelopment = <
  T extends {
    stage?: string;
  }
>() => {
  return where((item: T) => {
    if (import.meta.env.MODE === 'development') {
      return true;
    }
    return item.stage !== 'draft';
  });
};

export const onlyInDevelopment = () => {
  return where(() => {
    return import.meta.env.MODE === 'development';
  });
};

export const whereSlugEquals = <T extends { _meta: Meta & { slug: string } }>(
  slug?: string
) => {
  return where((item: T) => {
    console.log('slug', slug);
    console.log('item._meta.slug', item._meta.slug);
    return item._meta.slug === slug;
  });
};

export const whereSlugStartsWith = <
  T extends { _meta: Meta & { slug: string } }
>(
  slug?: string
) => {
  return where((item: T) => {
    return item._meta.slug.startsWith(slug);
  });
};

export function whereTaggedWith<T extends { tags?: string[] }>(
  tag: string | string[]
) {
  const toMatch = typeof tag === 'string' ? [tag] : tag;
  return where((item: T) => {
    const matched = query(from(toMatch), intersect(item.tags || []), count());
    return matched > 0;
  });
}

export const whereIdEquals = <T extends { _meta: Meta & { id: string } }>(
  id?: string
) => {
  return where((item: T) => {
    return item._meta.id === id;
  });
};
