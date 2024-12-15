import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { classnames } from '~/core/classnames';

import { useDisplayVersion } from './useDisplayVersion';

export function DisplayVersion({
  className,
  version,
}: {
  className?: string;
  version: Parameters<typeof useDisplayVersion>[0];
}) {
  const displayVersion = useDisplayVersion(version);

  return (
    <span className={classnames('flex gap-2 items-center', className)}>
      <GitHubLogoIcon />
      <span className="font-semibold">
        zenobi-us/zenobi-us@{displayVersion}
      </span>
    </span>
  );
}
