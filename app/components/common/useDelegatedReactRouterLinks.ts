import * as React from 'react';
import { useNavigate } from '@remix-run/react';

function useDelegatedReactRouterLinks(nodeRef: React.RefObject<HTMLElement>) {
  const navigate = useNavigate();

  React.useEffect(
    function Delegate() {
      const node = nodeRef.current;
      const handler = (event: MouseEvent) => {
        if (!nodeRef.current) {
          return;
        }

        if (!(event.target instanceof HTMLElement)) {
          return;
        }

        const a = event.target.closest('a');

        if (
          a && // is anchor or has anchor parent
          a.hasAttribute('href') && // has an href
          a.host === window.location.host && // is internal
          event.button === 0 && // left click
          (!a.target || a.target === '_self') && // Let browser handle "target=_blank" etc.
          !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // not modified
        ) {
          event.preventDefault();
          const { pathname, search, hash } = a;
          navigate({ pathname, search, hash });
        }
      };

      if (!node) {
        return;
      }
      node.addEventListener('click', handler);

      return () => {
        node?.removeEventListener('click', handler);
      };
    },
    [navigate, nodeRef]
  );
}

export { useDelegatedReactRouterLinks };
