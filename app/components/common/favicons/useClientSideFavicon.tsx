import { renderToString } from 'react-dom/server';
import { useEffect } from 'react';

import { isBrowser } from '~/core/is-browser';

import type { LogoProps } from './Logo';
import { Logo, LogoPropSchema } from './Logo';

function renderSvgStringToBase64(props: LogoProps): string {
  const logoAsString = renderToString(<Logo {...props} />);
  return `data:image/svg+xml;base64,${window.btoa(logoAsString)}`;
}

const DefaultColours = LogoPropSchema.parse({});

function isObjectSame(a: LogoProps, b: LogoProps): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * A favicon manager that will use localstorage to read colours
 * and render our Logo as a favicon
 *
 * - read local storage for the colours
 * - render the logo as an SVG string
 * - convert the SVG string to a base64 string
 * - set link tag in the head with the base64 string
 * - renders nothing at its location
 */
export function useClientSideFavicon(colours: LogoProps) {
  useEffect(
    function UpdateFaviconOnChange() {
      if (!isBrowser) {
        return;
      }
      if (!colours) {
        return;
      }
      if (Object.keys(colours).length === 0) {
        return;
      }
      if (isObjectSame(DefaultColours, colours)) {
        return;
      }

      const logo = renderSvgStringToBase64(colours);

      // try to find the existing favicon and update it
      // either select by the data attribute or the rel attribute
      const existingFavicon = document.querySelector(
        'link[data-clientside-favicon], link[rel="icon"]'
      );

      if (existingFavicon) {
        existingFavicon.setAttribute('href', logo);
        return;
      }

      // otherwise create a new favicon
      const link = document.createElement('link');
      link.setAttribute('type', 'image/svg+xml');
      link.setAttribute('rel', 'icon');
      link.setAttribute('href', logo);
      link.setAttribute('data-clientside-favicon', '');
      document.head.appendChild(link);
    },
    [colours]
  );
}
