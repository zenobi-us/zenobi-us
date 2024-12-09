import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { classnames } from '~/core/classnames';
import { Box } from '~/components/ds/box/Box';
import { TextInputStyles } from '~/components/ds/form/TextInput';

type SelectInputProps = InputHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  isDirty?: boolean;
  isValidating?: boolean;
  isTouched?: boolean;
  options: { label: string; value: string }[];
};
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    { className, invalid, isDirty, isTouched, isValidating, options, ...props },
    ref
  ) => {
    return (
      <Box
        asChild
        className={classnames(
          'color-palette-input',
          className,
          TextInputStyles({
            isDirty: !!isDirty,
            isEmpty: !props.value,
            isInvalid: !!invalid,
            isValidating: !!isValidating,
            isTouched: !!isTouched,
          })
        )}
      >
        <select
          {...props}
          ref={ref}
        >
          {options.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
      </Box>
    );
  }
);
SelectInput.displayName = 'SelectInput';
