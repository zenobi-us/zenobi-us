import type { Meta, StoryObj } from '@storybook/react';
import { LoremIpsum } from 'react-lorem-ipsum';
import { createRemixStub } from '@remix-run/testing';

import { Site } from '~/components/ds/sitelayout/Site';

import { HomePage } from './HomePage';

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  title: 'layouts/HomePage',
  parameters: {
    controls: { expanded: true },
  },
  decorators: [
    (Story) => {
      return (
        <Site.Main>
          <Story />
        </Site.Main>
      );
    },
    (Component) =>
      createRemixStub([
        {
          path: '/',
          Component,
        },
      ])({}),
  ],
};

export const Template = (args) => <HomePage {...args} />;

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Normal: Story = {
  args: {
    children: (
      <LoremIpsum
        p={1}
        avgSentencesPerParagraph={2}
        avgWordsPerSentence={5}
      />
    ),
  },
};
