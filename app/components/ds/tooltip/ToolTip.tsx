import { type ComponentProps } from 'react';

import { classnames } from '~/core/classnames';
import {
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ds/popover/Popover';
import { Box } from '~/components/ds/box/Box';

export function Tooltip({
  trigger,
  children,
  side,
  sideAlign,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
} & Pick<ComponentProps<typeof PopoverContent>, 'side' | 'sideAlign'>) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>

      <PopoverContent
        side={side}
        sideAlign={sideAlign}
        className={classnames(
          'flex flex-col justify-center gap-2',
          'border-border-informative',
          'bg-background-overlay',
          'text-text-hover',
          'rounded-md',
          'border-2'
        )}
      >
        <PopoverArrow />
        <Box className="flex flex-col gap-2">{children}</Box>
      </PopoverContent>
    </Popover>
  );
}
