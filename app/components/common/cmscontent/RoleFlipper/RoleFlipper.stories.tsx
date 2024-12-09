import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';

import { RoleFlipper } from './RoleFlipper';

const meta: Meta<typeof RoleFlipper> = {
  component: RoleFlipper,
  title: 'cmscontent/RoleFlipper',
  parameters: {
    controls: { expanded: true },
    SiteLayout: { centered: true },
  },
  render: Template,
};

function Template(args) {
  return (
    <div className="w-[720px] text-center text-4xl prose-lg leading-14">
      I&apos;m Zenobius.
      <br />
      A <RoleFlipper {...args} />
      <br />
      Based in Australia
    </div>
  );
}

export default meta;

type Story = StoryObj<typeof RoleFlipper>;

export const WithStaticListOfRoles: Story = {
  args: {
    roles: Array.from(Array(10), () => faker.person.jobTitle()),
  },
};

export const WithCallbackToGetRole: Story = {
  args: {
    roles: undefined,
    getRole() {
      return faker.person.jobTitle();
    },
  },
};
