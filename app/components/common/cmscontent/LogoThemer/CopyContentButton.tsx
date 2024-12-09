import type { ComponentProps } from 'react';

import { useClipboard } from './useClipboard';
import { ButtonWithFeedback } from './ButtonWithFeedback';

export function CopyContentButton({ children, copiedLabel, content, ...props }:ComponentProps<typeof ButtonWithFeedback> & {
  copiedLabel?: string;
  content: string
}) {

  const [copied, onClick] = useClipboard(content, {
    successDuration: 2000,
  });

  return (
    <ButtonWithFeedback
      onClick={onClick}
      feedback={copied ? copiedLabel : null}
      {...props}

    >
      {children}
    </ButtonWithFeedback>
  );
}


