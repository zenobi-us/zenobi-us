import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { Box, type BoxProps } from '../box/Box';

const Styles = tv({
  slots: {
    block: [
      'bg-background-modal',
      'border-border-modal',
      'z-50',
      'rounded-sm',
      'border',
      'p-2',
      'text-text-base',
      'shadow-sm',
      'outline-none',
    ],
    arrow: ['w-5', 'h-2', '*:[fill:currentColor]'],
  },
});

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & BoxProps
>(({ className, ...props }) => {
  const styles = Styles();
  return (
    <Box
      className={classnames(className, styles.arrow())}
      {...props}
      asChild
    >
      <PopoverPrimitive.Arrow />
    </Box>
  );
});
PopoverArrow.displayName = 'PopoverArrow';

type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps & {
    sideAlign?: PopoverContentProps['align'];
    sideOffset?: PopoverContentProps['sideOffset'];
    className?: string;
  }
>(
  (
    { className, sideAlign = 'center', sideOffset = 4, children, ...props },
    ref
  ) => {
    const styles = Styles();
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={sideAlign}
          sideOffset={sideOffset}
          className={classnames(styles.block(), className)}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
};
