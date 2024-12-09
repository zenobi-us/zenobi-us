import { useEffect, useRef } from 'react';
import type { StoryFn, Meta } from '@storybook/react';

import { TextInput } from './TextInput';

export default {
  title: 'Ds/TextInput',
  tags: ['autodocs'],
  component: TextInput,
} as Meta<typeof TextInput>;

export const Basic: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};
Basic.args = {};
export const Disabled: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};
Disabled.args = {
  disabled: true,
  value: 'disabled',
};

export const Valid: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};
Valid.args = {
  value: '2',
  pattern: '\\d+',
};

export const Invalid: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};
Invalid.args = {
  value: 'must be numbers',
  pattern: '\\d+',
};

export const Focused: StoryFn<typeof TextInput> = (args) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(function SimulateElementFocus() {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  return (
    <TextInput
      {...args}
      ref={inputRef}
    />
  );
};
Focused.args = {};
