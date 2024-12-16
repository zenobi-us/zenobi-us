import React, { forwardRef } from 'react';
import { type DetailedHTMLProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: [
    'text-text-input-label bg-background-input border-2 border-border-input',
    'py-2 px-4',
    'focus:outline-none focus:ring-2 focus:ring-border-muted focus:ring-opacity-50',
  ],
  variants: {
    invalid: {
      true: ['py-2 px-4', 'text-text-critical', 'bg-background-critical'],
    },
    isDirty: { true: '' },
    isValidating: { true: '' },
    isTouched: { true: '' },
    isEmpty: { true: '' },
  },
});

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  VariantProps<typeof Styles> &
    DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
>(({ isDirty, isTouched, isValidating, invalid, className, ...props }, ref) => {
  return (
    <textarea
      {...props}
      className={classnames(
        'text-area-input flex flex-grow',
        className,
        Styles({
          invalid: !!invalid,
          isTouched: !!isTouched,
          isDirty: !!isDirty,
          isValidating: !!isValidating,
        })
      )}
      placeholder={props.placeholder || ' '}
      ref={ref}
    />
  );
});
TextAreaInput.displayName = 'TextAreaInput';
