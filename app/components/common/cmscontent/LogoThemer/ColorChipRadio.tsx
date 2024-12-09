import { tv } from 'tailwind-variants';
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

import { classnames } from '~/core/classnames';

import { ColorChip } from './ColorChip';

export const Styles = tv({
  slots: {
    block: [
      'flex flex-row flex-wrap items-start justify-start cursor-pointer p-0',
    ],
    palette: [
      'flex flex-row flex-wrap items-start justify-start border-0 p-Large gap-5 w-200',
    ],
    button: [
      'flex flex-col items-center justify-center border-transparent border-2 rounded-Large border-solid cursor-pointer p-10',
    ],
    buttonSelected: ['border-white'],
    input: ['w-full p-15'],
    buttonRadio: ['hover:border-current'],
    chip: ['w-22 h-22'],
  },
});

export const ColorChipRadio = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    value: string;
    name?: string;
    selected?: boolean;
    square?: boolean;
  }
>(({ name, selected, square, value, onChange }, ref) => {
  const styles = Styles();
  const id = useId();
  return (
    <ColorChip
      color={value}
      name={name}
      className={classnames(
        'color-palette-input-chip-radio',
        styles.buttonRadio(),
        square && styles.chip()
      )}
    >
      <label htmlFor={id}>{name}</label>
      <input
        id={id}
        placeholder=" "
        type="radio"
        value={value}
        checked={!!selected}
        style={{ display: 'none' }}
        onChange={onChange}
        ref={ref}
      />
    </ColorChip>
  );
});
ColorChipRadio.displayName = 'ColorChipRadio';
