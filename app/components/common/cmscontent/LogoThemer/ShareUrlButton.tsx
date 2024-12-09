import { useMemo } from 'react';

import { CopyContentButton } from './CopyContentButton';

export function ShareUrlButton({ hash }: { hash: string }) {
  const hereUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.location.href;
  }, []);

  const shareUrl = new URL(hereUrl);
  shareUrl.hash = `?theme=${hash}`;

  return (
    <CopyContentButton
      content={shareUrl.toString()}
      copiedLabel="Copied"
    >
      Share URL
    </CopyContentButton>
  );
}
