import type { StoryFn, Meta } from '@storybook/react';
import { useEffect, useRef } from 'react';

import { TextAreaInput } from './TextAreaInput';

export default {
  title: 'Ds/TextAreaInput',
  tags: ['autodocs'],
  component: TextAreaInput,
} as Meta<typeof TextAreaInput>;

export const Basic: StoryFn<typeof TextAreaInput> = (args) => {
  return <TextAreaInput {...args} />;
};
Basic.args = {};
export const Disabled: StoryFn<typeof TextAreaInput> = (args) => {
  return <TextAreaInput {...args} />;
};
Disabled.args = {
  disabled: true,
  value: 'disabled',
};

export const Valid: StoryFn<typeof TextAreaInput> = (args) => {
  return <TextAreaInput {...args} />;
};
Valid.args = {
  value: '2',
};

export const Invalid: StoryFn<typeof TextAreaInput> = (args) => {
  return <TextAreaInput {...args} />;
};
Invalid.args = {
  value: 'must be numbers',
};

export const Focused: StoryFn<typeof TextAreaInput> = (args) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(function FocusElement() {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  return <TextAreaInput {...args} />;
};
Focused.args = {};
