import type { PropsWithChildren } from 'react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { Tooltip } from '../ds/tooltip/ToolTip';
import { Box } from '../ds/box/Box';
import { Link } from '../ds/link/Link';

import { useDisplayVersion } from './useDisplayVersion';

export function VersionTooltip({
  version,
  children,
}: PropsWithChildren<{
  version: Parameters<typeof useDisplayVersion>[0];
}>) {
  return (
    <Tooltip
      sideAlign="start"
      side="bottom"
      trigger={children}
    >
      <Box className="flex flex-col gap-2 divide-y-2 divide-dotted divide-opacity-80 divide-border-informative">
        <Box
          className="flex gap-2 items-center"
          asChild
        >
          <Link
            href="https://github.com/zenobi-us/zenobi-us"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubLogoIcon />
            <Box className="font-semibold">zenobi-us/zenobi-us</Box>
          </Link>
        </Box>
        <Box className="flex flex-col gap-2 pt-2">
          <Box className="flex gap-2">
            <Box className="font-semibold min-w-16 justify-end">hash</Box>
            <Box asChild>
              <Link
                target="_blank"
                href={`https://github.com/zenobi-us/zenobi-us/commit/${version.hash}`}
                rel="noreferrer"
              >
                {version.hash}
              </Link>
            </Box>
          </Box>
          <Box className="flex gap-2">
            <Box className="font-semibold min-w-16 justify-end">branch</Box>
            <Box asChild>
              <Link
                target="_blank"
                href={`https://github.com/zenobi-us/zenobi-us/compare/${version.branchname}`}
                rel="noreferrer"
              >
                {version.branchname}
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
}
