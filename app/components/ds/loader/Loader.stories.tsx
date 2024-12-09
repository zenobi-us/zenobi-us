import type { Meta, StoryObj } from '@storybook/react';

import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  component: Loader,
  title: 'Loader',
  parameters: {
    controls: { expanded: true },
    SiteLayout: {
      padded: true,
      center: true,
    },
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof Loader>;

export const Normal: Story = {
  args: {},
};
