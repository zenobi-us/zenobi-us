import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../box/Box';

import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: 'Divider',
  parameters: {
    controls: { expanded: true },
    SiteLayout: {
      center: true,
    },
  },
  render: (args) => (
    <Box className="w-96 h-96">
      <Divider {...args} />
    </Box>
  ),
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Vertical: Story = {
  args: {
    className: 'bg-background-base',
    direction: 'vertical',
  },
};

export const Horizontal: Story = {
  args: {
    className: 'bg-background-base',
    direction: 'horizontal',
  },
};

export const VerticalWithLabel: Story = {
  args: {
    className: 'bg-background-base',
    direction: 'vertical',
    label: 'Label',
  },
};

export const HorizontalWithLabel: Story = {
  args: {
    className: 'bg-background-informative',
    direction: 'horizontal',
    label: 'Label',
  },
};
