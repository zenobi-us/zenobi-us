import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';

import { RoleCard } from './RoleCard';

const meta: Meta<typeof RoleCard> = {
  component: RoleCard,
  title: 'cmscontent/RoleCard',
  parameters: {
    controls: { expanded: true },
    SiteLayout: { centered: true },
  },
  render: Template,
};

function Template(args) {
  return (
    <div className="w-[640px] text-4xl prose-lg leading-14">
      <RoleCard {...args} />
    </div>
  );
}

export default meta;

type Story = StoryObj<typeof RoleCard>;

export const WithStaticListOfRoles: Story = {
  args: {
    role: faker.person.jobTitle(),
  },
};
