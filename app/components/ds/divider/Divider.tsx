import classNames from 'classnames';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

export function Divider({
  size,
  direction,
  className,
  label,
  ...props
}: DividerProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
  const styles = DividerRecipe({
    size,
    direction,
  });

  if (!label) {
    return (
      <Box
        {...props}
        className={classNames('divider', className, styles)}
      />
    );
  }

  return (
    <Box
      aria-label={label}
      className={classnames(
        'flex items-center gap-2',
        direction === 'horizontal' && 'flex-row',
        direction === 'vertical' && 'flex-col'
      )}
    >
      <Box
        {...props}
        className={classNames('divider', className, styles)}
      />
      {label}
      <Box
        {...props}
        className={classNames('divider', className, styles)}
      />
    </Box>
  );
}

const DividerRecipe = tv({
  base: '',
  defaultVariants: {
    direction: 'horizontal',
    size: 'medium',
  },
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    direction: {
      vertical: {},
      horizontal: {},
    },
  },
  compoundVariants: [
    {
      size: 'small',
      direction: 'horizontal',
      className: ['mt-2 mb-2 h-1 w-full'],
    },
    {
      size: 'small',
      direction: 'vertical',
      className: ['ml-2 mr-2 w-1 h-full'],
    },
    {
      size: 'medium',
      direction: 'horizontal',
      className: ['mt-2 mb-2 h-2 w-full'],
    },
    {
      size: 'medium',
      direction: 'vertical',
      className: ['ml-2 mr-2 w-2 h-full'],
    },
    {
      size: 'large',
      direction: 'horizontal',
      className: ['mt-2 mb-2 h-4 w-full'],
    },
    {
      size: 'large',
      direction: 'vertical',
      className: ['ml-2 mr-2 w-4 h-full'],
    },
  ],
});

type DividerProps = VariantProps<typeof DividerRecipe>;
