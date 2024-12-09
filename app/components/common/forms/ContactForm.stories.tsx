import { useCallback, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ContactForm } from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  component: ContactForm,
  title: 'ContactForm',
  parameters: {
    controls: { expanded: true },
    SiteLayout: {
      padded: true,
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Stateful: Story = {
  render: function StatefulStory(args) {
    const [status, setStatus] = useState(args.status);
    useEffect(
      function UpdateStatusOnAddonsChange() {
        setStatus(args.status);
      },
      [args.status]
    );

    const handleSubmit = useCallback(
      (data: Parameters<typeof args.onSubmit>[0]) => {
        setStatus('sending');
        setTimeout(() => {
          setStatus('sent');
          args.onSubmit(data);
        }, 1000);
      },
      [args]
    );

    return (
      <ContactForm
        {...args}
        status={status}
        onSubmit={handleSubmit}
      />
    );
  },
  args: {
    status: 'idle',
  },
};

export const Idle: Story = {
  args: {
    status: 'idle',
  },
};
export const Sending: Story = {
  args: {
    status: 'sending',
  },
};

export const Sent: Story = {
  args: {
    status: 'sent',
  },
};
