import type { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Box } from '~/components/ds/box/Box';

const ColourChipStyles = tv({
  base: [
    'flex flex-col items-center justify-center w-8 h-8 rounded-full cursor-pointer',
    'border-solid border-transparent border-2',
    'p-2',
  ],
  variants: {
    selected: {
      true: ['border-white'],
    },
  },
});

export function ColorChip({
  color,
  name,
  selected,
  className,
  ...props
}: PropsWithChildren<
  {
    color: string;
    name?: string;
    selected?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const styles = ColourChipStyles({ selected });

  return (
    <Box
      key={name}
      title={name}
      className={classnames('color-palette-input-chip', styles, className)}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
}
