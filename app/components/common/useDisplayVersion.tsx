import type { SerializeFrom } from '@remix-run/node';
import { useMemo } from 'react';

import type { loader } from '../../root';

export function useDisplayVersion(
  version: Awaited<SerializeFrom<typeof loader>>['version']
) {
  const displayVersion = useMemo(() => {
    if (version.buildno) {
      return `${version.version}+${version.buildno}`;
    }

    return version.version;
  }, [version.version, version.buildno]);

  return displayVersion;
}
