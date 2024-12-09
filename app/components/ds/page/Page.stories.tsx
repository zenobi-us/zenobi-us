import type { Meta, StoryObj } from '@storybook/react';
import { LoremIpsum, Avatar, name, surname, username } from 'react-lorem-ipsum';

import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
  title: 'Pages/Page',
  parameters: {
    controls: { expanded: true },
  },
};

export const Template = (args) => <Page {...args} />;

export default meta;
type Story = StoryObj<typeof Page>;

export const Normal: Story = {
  args: {
    children: <LoremIpsum p={8} />,
    asideSlot: (
      <div>
        <Avatar
          gender="male"
          className="avatar"
          width="200"
          height="200"
          alt="Avatar"
        />
        <div className="name">{name('male')}</div>
        <div className="surname">{surname()}</div>
        <div className="username">{username()}</div>
      </div>
    ),
  },
};
