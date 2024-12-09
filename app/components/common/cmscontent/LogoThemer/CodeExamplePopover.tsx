import { useMemo } from 'react';
import { CodeIcon } from '@radix-ui/react-icons';
import dedent from 'dedent';

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ds/popover/Popover';
import { Box } from '~/components/ds/box/Box';
import type { LogoProps } from '~/components/common/favicons/Logo';

import { CopyContentButton } from './CopyContentButton';

export function CodeExamplePopover({ values }: { values: LogoProps }) {
  const codeShareContent = useMemo(() => {
    return dedent(`
      #!bin/bash

      set -e

      declare -A theme

      theme[bgFill]="${values.bgFill}"
      theme[bgStroke]="${values.bgStroke}"
      theme[fgFill]="${values.fgFill}"
      theme[fgStroke]="${values.fgStroke}"
      theme[arrowStroke]="${values.arrowStroke}"
      theme[baseStroke]="${values.baseStroke}"
    `);
  }, [values]);

  return (
    <Popover>
      <Box
        className="bg-background-button-secondary border-button-secondary text-button-secondary cursor-pointer"
        asChild
      >
        <PopoverTrigger>
          <CodeIcon
            width={22}
            height={22}
          />
        </PopoverTrigger>
      </Box>
      <PopoverContent
        className="bg-background-card border-card flex flex-col items-start justify-start gap-4"
        side="right"
      >
        <PopoverArrow className="bg-background-card" />
        <Box className="flex flex-grow flex-col gap-4">
          <Box className="bg-background-base border-base text-base p-2">
            <pre>{codeShareContent}</pre>
          </Box>
          <Box className="text-xs text-text-informative border-border-informative p-2 rounded-sm">
            This is for me to copy into my build tools that generate my favicon.
          </Box>
        </Box>

        <CopyContentButton
          content={codeShareContent}
          copiedLabel="Copied"
        >
          Copy Theme Code
        </CopyContentButton>
      </PopoverContent>
    </Popover>
  );
}
