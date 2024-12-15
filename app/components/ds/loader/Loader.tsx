import { tv, type VariantProps } from 'tailwind-variants';
import { useId } from 'react';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

const Styles = tv({
  slots: {
    base: 'flex flex-grow items-center justify-center gap-1',
    dots: 'flex gap-1 transition-all duration-1000',
    dot: 'w-1 h-1 rounded-full',
    label: 'sr-only',
  },
  variants: {
    effect: {
      blurred: {
        base: 'contrast-0 mix-blend-multiply blur-md',
      },
    },
    tone: {
      base: {
        dot: 'bg-background-informative',
      },
      muted: {
        dot: 'bg-background-muted',
      },
      cautious: {
        dot: 'bg-background-cautious',
      },
      critical: {
        dot: 'bg-background-critical',
      },
      positive: {
        dot: 'bg-background-positive',
      },
    },
    blurred: {
      extreme: {
        base: 'contrast-0 mix-blend-multiply blur-xl',
      },
      more: {
        base: 'contrast-0 mix-blend-multiply blur-md',
      },
      some: {
        base: 'contrast-0 mix-blend-multiply blur-sm',
      },
    },

    direction: {
      row: {
        base: 'flex-row',
      },
      column: {
        base: 'flex-col',
      },
    },
    labelVisible: {
      true: {
        label: 'not-sr-only text-sm text-text-muted',
      },
    },
    size: {
      xsm: {
        dot: 'w-1 h-1',
      },
      sm: {
        dot: 'w-2 h-2',
      },
      md: {
        dot: 'w-4 h-4',
      },
      lg: {
        dot: 'w-8 h-8',
      },
      xlg: {
        dot: 'w-12 h-12',
      },
      xxlg: {
        dot: 'w-16 h-16',
      },
    },
  },
  defaultVariants: {
    tone: 'base',
    direction: 'column',
    size: 'md',
    labelVisible: false,
  },
});

type LoaderStyleProps = VariantProps<typeof Styles>;

export function Loader({
  label = 'Loading...',
  ...props
}: { label: string } & LoaderStyleProps) {
  const styles = Styles(props);
  const id = useId();
  return (
    <Box
      aria-labelledby={id}
      className={styles.base()}
    >
      <Box className={styles.dots()}>
        <Dot className="delay-500" />
        <Dot className="delay-300" />
        <Dot className="delay-100" />
      </Box>
      <Box
        className={styles.label()}
        id={id}
      >
        {label}
      </Box>
    </Box>
  );
}

function Dot({
  className,
  ...props
}: { className: string } & LoaderStyleProps) {
  const styles = Styles(props);
  return (
    <Box
      className={classnames(className, 'flex flex-col relative', styles.dot())}
    >
      <Box
        className={classnames(
          'absolute animate-bounce',
          className,
          styles.dot()
        )}
      />
      <Box
        className={classnames(
          'absolute',
          'opacity-60',
          'animate-ping',
          styles.dot()
        )}
      />
    </Box>
  );
}
