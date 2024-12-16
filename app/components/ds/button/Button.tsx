import React from 'react';
import { useCallback, useId, type PropsWithChildren } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

const Styles = tv({
  slots: {
    container: [
      'p-4 flex gap-4 items-center justify-center',

      'bg-none text-text-input-label',
      'font-button',
      'cursor-pointer',
      'rounded border-border-muted border-2',
      'active:border-border-positive',
      'hover:border-border-button',
      // 'disabled:border-none',
      'disabled:grayscale',
    ],
    label: ['flex gap-2 items-center'],
  },
  variants: {
    primary: {
      true: {
        container: [
          'text-text-button bg-background-button',
          'border-none',
          'hover:text-text-button-hover hover:bg-background-button-hover',
          'active:text-text-button-active active:bg-background-button-active',
          'active:outline-2 active:outline-solid active:outline-color-mix(in srgb, base, black 20%)',
          'focus:text-text-button-active focus:bg-background-button-active',
          'disabled:grayscale',
          'disabled:cursor-not-allowed',
        ],
      },
    },
    secondary: {
      true: {
        container: [
          'text-text-button-secondary bg-background-button-secondary',
          'hover:text-text-button-secondary-hover hover:bg-background-button-secondary-hover',
          'active:text-text-button-secondary-active active:bg-background-button-secondary-active',
          'focus:text-text-button-secondary-active focus:bg-background-button-secondary-active',
          'disabled:grayscale',
          'disabled:cursor-not-allowed',

          'border-1 border-solid border-button-secondary',
        ],
        label: ['text-text-button-secondary'],
      },
    },
    link: {
      true: {
        container: [
          'border-none bg-none p-0 px-1 inline',
          'text-text-link hover:text-text-link-hover active:text-text-link-active visited:text-text-link-visited',
        ],
        label: ['underline'],
      },
    },
    rounded: {
      true: {
        container: ['rounded-full px-8'],
      },
    },
    size: {
      small: {
        container: ['text-xs'],
      },
      medium: {
        container: ['text-sm'],
      },
      large: {
        container: ['text-base'],
      },
      xlarge: {
        container: ['text-lg'],
      },
      xxlarge: {
        container: ['text-xl'],
      },
    },
  },
});

export function Button({
  primary,
  secondary,
  rounded,
  size,
  link,
  beforeElement,
  afterElement,
  asChild,
  children,
  className,
  ...props
}: VariantProps<typeof Styles> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    beforeElement?: React.ReactNode;
    afterElement?: React.ReactNode;
    asChild?: boolean;
  }) {
  const id = useId();
  const styles = Styles({
    primary,
    secondary,
    size,
    rounded,
    link,
  });

  const Container = useCallback(
    ({ children }: PropsWithChildren) => (
      <Box
        {...props}
        asChild
        className={classnames('button', styles.container(), className)}
      >
        {children}
      </Box>
    ),
    [className, props, styles]
  );

  if (asChild) {
    return <Container>{children}</Container>;
  }

  return (
    <Container>
      <button aria-labelledby={`button-label-${id}`}>
        {beforeElement}
        <span
          id={`button-label-${id}`}
          className={classnames('button__label', styles.label())}
        >
          {children}
        </span>
        {afterElement}
      </button>
    </Container>
  );
}
