import { tv, type VariantProps } from 'tailwind-variants';
import { useId } from 'react';

import { Box } from '../box/Box';

const Styles = tv({
  slots: {
    base: 'flex flex-grow items-center justify-center gap-1',
    dots: 'flex gap-1',
    dot: 'w-1 h-1 bg-background-elevated rounded-full animate-ping',
    label: 'sr-only',
  },
  variants: {
    effect: {
      blurred: {
        base: 'contrast-0 mix-blend-multiply blur-xl',
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
    direction: 'column',
    size: 'md',
    labelVisible: false,
  },
});

type LoaderStyleProps = VariantProps<typeof Styles>;

export function Loader({
  direction,
  size = 'sm',
  effect,
  label = 'Loading...',
  labelVisible = false,
}: {
  label: string;
  effect?: LoaderStyleProps['effect'];
  direction?: LoaderStyleProps['direction'];
  size?: LoaderStyleProps['size'];
  labelVisible?: LoaderStyleProps['labelVisible'];
}) {
  const styles = Styles({ direction, effect, size, labelVisible });
  const id = useId();
  return (
    <Box
      aria-labelledby={id}
      className={styles.base({
        className: '',
      })}
    >
      <Box className={styles.dots()}>
        <Box
          className={styles.dot({
            className: 'animate-bounce delay-500',
          })}
        />
        <Box
          className={styles.dot({
            className: 'animate-bounce delay-300',
          })}
        />
        <Box
          className={styles.dot({
            className: 'animate-bounce delay-100',
          })}
        />
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
