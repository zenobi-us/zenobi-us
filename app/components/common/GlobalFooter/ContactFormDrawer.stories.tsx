import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '~/components/ds/box/Box';

import { ContactFormDrawer } from './ContactFormDrawer';

const meta: Meta<typeof ContactFormDrawer> = {
  component: ContactFormDrawer,
  title: 'ContactFormDrawer',
  parameters: {
    controls: { expanded: true },
  },
};

export const Template = (args) => (
  <Box className="flex flex-col">
    <Box className="flex w-full min-h-4 h-[1440px] bg-background-cautious" />
    <ContactFormDrawer {...args} />
    <Box className="flex w-full min-h-4 h-8 my-8 bg-background-cautious" />
  </Box>
);

export default meta;
type Story = StoryObj<typeof ContactFormDrawer>;

export const Normal: Story = {};
