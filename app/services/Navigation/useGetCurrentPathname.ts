import { useMatches } from "@remix-run/react";

export function useGetCurrentPathname(defaultTo = "/"){
  const matches = useMatches();
  return matches.at(-1)?.pathname ?? defaultTo;
}
