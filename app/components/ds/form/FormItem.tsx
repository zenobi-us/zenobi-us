import React from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { FormItemContext } from './FormFieldContext';

export const FormItem = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={classNames(
          'flex flex-col gap-1',
          'relative mt-2 mb-2',
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = 'FormItem';
