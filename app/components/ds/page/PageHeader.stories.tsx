import type { Meta, StoryObj } from '@storybook/react';

import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  component: PageHeader,
  title: 'PageHeader',
  parameters: {
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Normal: Story = {
  args: {
    title: 'Page Title',
    date: '2021-08-01',
  },
};
