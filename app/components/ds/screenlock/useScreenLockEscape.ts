import type { KeyboardEventHandler } from 'react';

export function useScreenLockEscape({ onClose }: UseScreenLockEscapeProps) {
  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      onClose();
    }
  };

  return { onKeyDown };
}
export type UseScreenLockEscapeProps = {
  onClose: () => void;
};
