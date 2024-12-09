import type { Meta, StoryObj } from '@storybook/react';
import { CameraIcon } from '@radix-ui/react-icons';

import { Box } from '../box/Box';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Button',
  parameters: {
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const All: Story = {
  render: (args) => (
    <Box className="gap-2 p-4 flex-col">
      <Button {...args}>Default</Button>
      <Button
        {...args}
        rounded
      >
        Default
      </Button>
      <Button
        {...args}
        disabled
      >
        Default Disabled
      </Button>
      <Button
        {...args}
        disabled
        rounded
      >
        Default Disabled
      </Button>
      <Button
        {...args}
        primary
      >
        Primary
      </Button>
      <Button
        {...args}
        rounded
        primary
      >
        Primary
      </Button>
      <Button
        {...args}
        secondary
      >
        Secondary
      </Button>
      <Button
        {...args}
        secondary
        rounded
      >
        Secondary
      </Button>
      <Button
        {...args}
        primary
        disabled
      >
        PrimaryDisabled
      </Button>
      <Button
        {...args}
        secondary
        disabled
      >
        SecondaryDisabled
      </Button>
      <Button
        {...args}
        beforeElement={<CameraIcon className="text-text-highlighted" />}
      >
        WithBeforeElement
      </Button>
      <Button
        {...args}
        afterElement={<CameraIcon className="text-text-highlighted" />}
      >
        WithAfterElement
      </Button>
      <Button
        {...args}
        beforeElement={<CameraIcon className="text-text-highlighted" />}
        afterElement={<CameraIcon className="text-text-highlighted" />}
      >
        WithBeforeAndAfterElement
      </Button>
    </Box>
  ),
  args: {
    children: 'All',
  },
};

export const WithPrefixIcon: Story = {
  args: {
    children: 'WithPrefixIcon',
    beforeElement: <CameraIcon className="text-text-highlighted" />,
  },
};
export const WithSuffixIcon: Story = {
  args: {
    children: 'WithSuffixIcon',
    afterElement: <CameraIcon className="text-text-highlighted" />,
  },
};
export const WithSuffixAndPrefixIcon: Story = {
  args: {
    children: 'WithSuffixAndPrefixIcon',
    afterElement: <CameraIcon className="text-text-highlighted text-lg" />,
    beforeElement: <CameraIcon className="text-text-highlighted" />,
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    primary: true,
  },
};
export const PrimaryDisabled: Story = {
  args: {
    children: 'PrimaryDisabled',
    primary: true,
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    secondary: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    children: 'SecondaryDisabled',
    secondary: true,
    disabled: true,
  },
};
