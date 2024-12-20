import type { Meta, StoryObj } from '@storybook/react';
import LoremIpsum from 'react-lorem-ipsum';

import { Box } from '~/components/ds/box/Box';

import { Notice } from './Notice';

const meta: Meta<typeof Notice> = {
  component: Notice,
  title: 'Notice',
  parameters: {
    SiteLayout: { centered: true },
  },
  render: (args) => (
    <Box className="w-full flex-col px-4">
      <Notice
        {...args}
        type="info"
      />
      <Notice
        {...args}
        type="positive"
      />
      <Notice
        {...args}
        type="critical"
      />
      <Notice
        {...args}
        type="cautious"
      />
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof Notice>;

export const All: Story = {
  args: {
    children: (
      <LoremIpsum
        p={1}
        avgSentencesPerParagraph={1}
      />
    ),
  },
};
