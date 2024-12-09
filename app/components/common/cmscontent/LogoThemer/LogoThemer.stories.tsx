import type { Meta, StoryObj } from '@storybook/react';

import { LogoThemer } from './LogoThemer';

const meta: Meta<typeof LogoThemer> = {
  component: LogoThemer,
  title: 'cmscontent/LogoThemer',
  parameters: {
    controls: { expanded: true },
  },
  render: Template,
};

function Template(args) {
  return <LogoThemer {...args} />;
}

export default meta;

type Story = StoryObj<typeof LogoThemer>;

export const Normal: Story = {
  args: {},
};
