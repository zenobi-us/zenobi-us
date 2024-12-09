import type { UIMatch } from '@remix-run/react';
import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import { z } from 'zod';

const HandleMetaDataSchema = z.object({
  globalNav: z.boolean().optional().default(true),
  globalFooter: z.boolean().optional().default(true),
});

export type HandleMetaData = z.infer<typeof HandleMetaDataSchema>;

export function createHandleMetaData(
  override?: Partial<HandleMetaData>,
): HandleMetaData {
  return {
    globalNav: true,
    globalFooter: true,
    ...override,
  };
}

function isRouteWithHandleMetaData(
  route: UIMatch,
): route is UIMatch<unknown, HandleMetaData> {
  return HandleMetaDataSchema.safeParse(route.handle).success;
}

function reduceBooleanFlag(
  matches: UIMatch[],
  flag: keyof HandleMetaData,
): boolean {
  return matches.reduce((acc, route) => {
    if (isRouteWithHandleMetaData(route)) {
      return route.handle[flag] && acc;
    }

    return acc;
  }, true);
}

export function useRouteHandles(): HandleMetaData {
  const matchedRoutes = useMatches();
  const validMatches = matchedRoutes.filter(isRouteWithHandleMetaData);

  const globalNav = useMemo(
    () => reduceBooleanFlag(validMatches, 'globalNav'),
    [validMatches],
  );

  const globalFooter = useMemo(
    () => reduceBooleanFlag(validMatches, 'globalFooter'),
    [validMatches],
  );

  return {
    globalNav,
    globalFooter,
  };
}
