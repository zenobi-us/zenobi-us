import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { Box } from '../ds/box/Box';

import { useDisplayVersion } from './useDisplayVersion';

export function DisplayVersion({
  version,
}: {
  version: Parameters<typeof useDisplayVersion>[0];
}) {
  const displayVersion = useDisplayVersion(version);

  return (
    <Box className="flex flex-col gap-2 text-text-muted text-xs">
      <Box className="flex gap-2 items-center">
        <GitHubLogoIcon />
        <Box className="font-semibold">
          zenobi-us/zenobi-us@{displayVersion}
        </Box>
      </Box>
    </Box>
  );
}
