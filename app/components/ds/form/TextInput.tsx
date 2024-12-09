import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import type { InputHTMLAttributes } from 'react';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

export const TextInputStyles = tv({
  base: [
    'text-text-input-label',
    'bg-background-card',
    'py-2 px-4',
    'focus:outline-none focus:ring-2 focus:ring-border-muted focus:ring-opacity-50',
  ],
  variants: {
    invalid: {
      true: ['text-text-critical', 'bg-background-critical', 'py-2 px-4'],
    },
    isDirty: { true: '' },
    isValidating: { true: '' },
    isTouched: { true: '' },
    isEmpty: { true: '' },
  },
});

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof TextInputStyles>;

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, invalid, isDirty, isTouched, isValidating, ...props },
    ref
  ) => {
    return (
      <Box
        asChild
        className={classnames(
          'text-input',
          className,
          TextInputStyles({
            isDirty: !!isDirty,
            isEmpty: !props.value,
            invalid: !!invalid,
            isValidating: !!isValidating,
            isTouched: !!isTouched,
          })
        )}
      >
        <input
          {...props}
          ref={ref}
          placeholder={props.placeholder || ' '}
          type={type}
        />
      </Box>
    );
  }
);
TextInput.displayName = 'TextInput';

export { TextInput };
