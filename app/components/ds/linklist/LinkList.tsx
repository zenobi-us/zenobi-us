import type { HTMLAttributes, PropsWithChildren } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  slots: {
    block: 'flex flex-col gap-4',
  },
  variants: {
    direction: {
      row: {
        block: 'flex-row',
      },
      column: {
        block: 'flex-col',
      },
    },
  },
});

export type LinkListVariants = VariantProps<typeof Styles>;

export type LinkListProps = PropsWithChildren<
  LinkListVariants & HTMLAttributes<HTMLDivElement>
>;

export function LinkList({
  className,
  children,
  direction,
  ...props
}: LinkListProps) {
  const styles = Styles({ direction });
  return (
    <div
      className={classnames('link-list', className, styles.block())}
      {...props}
    >
      {children}
    </div>
  );
}
