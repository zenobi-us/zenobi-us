import type { Decorator } from '@storybook/react';
import { tv } from 'tailwind-variants';

import { Site } from './Site';
const styles = tv({
  variants: {
    padded: {
      true: 'p-4',
    },
    centered: {
      true: 'flex justify-center items-center flex-grow',
    },
  },
});

export const WithSiteLayoutDecorator: Decorator = (Story, context) => {
  return (
    <Site
      pathId="unknown"
      className={styles(context.parameters.SiteLayout)}
    >
      <Story />
    </Site>
  );
};
