import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { tv } from 'tailwind-variants';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Label } from '@radix-ui/react-label';

import { useFormField } from './useFormField';

const Styles = tv({
  base: [
    'text-input-label',
    'font-input-label',
    'm-0 p-0 pb-0 w-full cursor-pointer',
    // 'focus-within:translate-x-[-1rem] translate-y-[-120%]',
    'disabled:cursor-not-allowed disabled:opacity-70',
  ],
  variants: {
    error: {
      true: ['text-text-critical'],
    },
    empty: {
      true: [
        // 'absolute top-[0.25rem]'
      ],
    },
  },
});
export const FormLabel = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  const styles = Styles({
    error: !!error,
    empty: true,
  });

  return (
    <Label
      ref={ref}
      className={classNames(styles, className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';
