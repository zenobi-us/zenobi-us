import React from 'react';
import type { ForwardedRef, PropsWithChildren, RefObject } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { tv, type VariantProps } from 'tailwind-variants';
import omit from 'lodash/omit';

import { classnames } from '~/core/classnames';

import { ComponentWithRef } from './ComponentWithRef';

const Styles = tv({
  base: 'flex',
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
  },
});

type AsChildProps<DefaultElementProps> = PropsWithChildren<
  { asChild?: boolean } & DefaultElementProps
>;

export type BoxProps = AsChildProps<
  {
    dividers?: boolean;
    className?: string;
    style?: object;
    inline?: boolean;
  } & React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof Styles>
>;

export const Box = ({
  className,
  direction,
  children,
  style,
  ...props
}: BoxProps &
  (
    | {
        asChild: true;
        ref?: never;
      }
    | {
        asChild?: undefined | false;
        ref?: RefObject<HTMLDivElement> | ForwardedRef<HTMLDivElement>;
      }
  )) => {
  const styles = Styles({ direction });
  const classString = classnames('box', className, styles);

  if (props.asChild) {
    const propsWithoutAsChild = omit(props, 'asChild');
    return (
      <Slot
        className={classString}
        style={style}
        {...propsWithoutAsChild}
      >
        {children}
      </Slot>
    );
  }

  return (
    <ComponentWithRef
      ref={props.ref}
      className={classString}
      style={style}
      {...props}
    >
      {children}
    </ComponentWithRef>
  );
};
