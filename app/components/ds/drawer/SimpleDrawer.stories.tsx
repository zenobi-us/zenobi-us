import type { Meta, StoryObj } from '@storybook/react';
import { LoremIpsum } from 'react-lorem-ipsum';
import { type ComponentProps } from 'react';

import { Button } from '../button/Button';

import { SimpleDrawer } from './SimpleDrawer';

const Template = (args) => {
  return <SimpleDrawer {...args} />;
};

const meta: Meta<typeof SimpleDrawer> = {
  component: SimpleDrawer,
  title: 'ds/SimpleDrawer',
  parameters: {
    controls: { expanded: true },
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
  render: (args) => (
    <Template
      {...args}
      trigger={<Button>Open</Button>}
      title="Title"
      description="Description"
      footer="Footer"
    >
      <LoremIpsum
        p={1}
        avgSentencesPerParagraph={2}
        avgWordsPerSentence={5}
      />
    </Template>
  ),
};

export default meta;

type Story = StoryObj<ComponentProps<typeof SimpleDrawer>>;

export const Default: Story = {
  args: {
    className: 'm-8',
  },
};

export const BottomLeft: Story = {
  args: {
    anchor: 'bottomleft',
  },
};
export const BottomRight: Story = {
  args: {
    anchor: 'bottomright',
  },
};

export const TopMiddle: Story = {
  args: {
    anchor: 'top',
  },
};

export const TopRight: Story = {
  args: {
    anchor: 'topright',
  },
};
export const Right: Story = {
  args: {
    anchor: 'right',
  },
};

export const Left: Story = {
  args: {
    anchor: 'left',
  },
};
