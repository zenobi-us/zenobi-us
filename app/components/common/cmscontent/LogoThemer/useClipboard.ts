import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';

interface IOptions {
  /**
   * Reset the status after a certain number of milliseconds. This is useful
   * for showing a temporary success message.
   */
  successDuration?: number;
}

export function useClipboard(
  text: string,
  options?: IOptions
): [boolean, () => void] {
  const [isCopied, setIsCopied] = useState(false);
  const successDuration = options && options.successDuration;

  useEffect(
    function Copy() {
      if (isCopied && successDuration) {
        const id = setTimeout(() => {
          setIsCopied(false);
        }, successDuration);

        return () => {
          clearTimeout(id);
        };
      }
    },
    [isCopied, successDuration]
  );

  return [
    isCopied,
    () => {
      const didCopy = copy(text);
      setIsCopied(didCopy);
    },
  ];
}
