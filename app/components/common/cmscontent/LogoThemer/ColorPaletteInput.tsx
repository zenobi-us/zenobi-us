import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Popover } from '@radix-ui/react-popover';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Box } from '~/components/ds/box/Box';
import { TextInputStyles } from '~/components/ds/form/TextInput';
import {
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ds/popover/Popover';

import { ColorChipRadio } from './ColorChipRadio';
import { ColorChip } from './ColorChip';

const ColourPaletteStyles = tv({
  slots: {
    block:
      'flex flex-row flex-wrap items-start justify-start cursor-pointer p-0',
    button: '',
    input: '',
    palette: '',
  },
});

type ColorPaletteInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  isDirty?: boolean;
  isValidating?: boolean;
  isTouched?: boolean;
  palette: Record<string, string>;
};

export const ColorPaletteInput = forwardRef<
  HTMLInputElement,
  ColorPaletteInputProps
>(({ palette, invalid, isDirty, isValidating, ...props }, ref) => {
  const styles = ColourPaletteStyles();

  const value = typeof props.value === 'string' ? props.value : '';
  return (
    <Popover>
      <Box
        className={classnames(
          'color-palette-input',
          TextInputStyles({
            isDirty: !!isDirty,
            isEmpty: !props.value,
            invalid: !!invalid,
            isValidating: !!isValidating,
          }),
          styles.block()
        )}
        asChild
      >
        <PopoverTrigger>
          <ColorChip
            className={classnames(
              'color-palette-input-selected-chip',
              styles.button(),
              styles.input()
            )}
            name={['transparent', 'currentColor'].includes(value) ? value : ''}
            color={value ?? ''}
          />
        </PopoverTrigger>
      </Box>
      <PopoverContent
        sideAlign="start"
        side="left"
        className="flex flex-col justify-center gap-2 bg-background-button-secondary border-button-secondary-hover border-border-button-secondary-hover"
      >
        <PopoverArrow className="bg-background-button-secondary-hover" />
        <ColorChipRadio
          color="base"
          name="currentColor"
          ref={ref}
          value="currentColor"
        />

        <Box
          className={classnames(
            'color-palette-input-palette',
            styles.palette()
          )}
        >
          {Object.entries(palette).map(([name, color]) => (
            <ColorChipRadio
              key={name}
              color={color}
              selected={props.value === color}
              value={color}
            />
          ))}
        </Box>
      </PopoverContent>
    </Popover>
  );
});
ColorPaletteInput.displayName = 'ColorPaletteInput';
