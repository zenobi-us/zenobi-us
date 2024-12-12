import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/components/ds/button/Button';

import { ContactFormDrawer } from './ContactFormDrawer';

const meta: Meta<typeof ContactFormDrawer> = {
  component: ContactFormDrawer,
  title: 'ContactFormDrawer',
  parameters: {
    controls: { expanded: true },
  },
  render: (args) => <ContactFormDrawer {...args} />,
};

export default meta;
type Story = StoryObj<typeof ContactFormDrawer>;

export const Normal: Story = {
  args: {
    children: <Button>Contact Me</Button>,
  },
};
