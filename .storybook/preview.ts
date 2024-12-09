import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, Decorator } from '@storybook/react';

import { WithSiteLayoutDecorator } from '../app/components/ds/sitelayout/StorybookDecorators';

import '../app/main.css';
import '../app/theme/fonts/robotoslab';

export const decorators: Decorator[] = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  WithSiteLayoutDecorator,
];

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
