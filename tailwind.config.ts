import type { Config } from 'tailwindcss';
import { gridAreas } from 'tailwindcss-grid-areas';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
import { createThemes } from 'tw-colors';

import { RosePineDawn } from './app/theme/colours/rosepinedawn';
import { RosePineMoon } from './app/theme/colours/rosepinemoon';
import { Typeface, TypefaceNames } from './app/theme/fonts/typeface';

export default {
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is(.dark *)',
    ],
  ],
  content: ['./app/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        'border-spin': {
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
      },
      animation: {
        'border-spin': 'border-spin 7s linear infinite',
      },
      /**
       * Provide my own typography scales
       */
      fontSize: Typeface,
      lineHeight: {
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
      },
    },
    /**
     * Override the default font family with the custom typeface.
     **/
    fontFamily: TypefaceNames,
  },
  plugins: [
    animate,
    typography(),
    gridAreas({}),
    /**
     * Create themes for the light and dark modes
     * based on my Rose Pine Interpolations
     */
    createThemes({
      light: RosePineDawn,
      dark: RosePineMoon,
    }),
  ],
} satisfies Config;
