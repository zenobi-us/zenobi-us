import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { PageHeader } from './PageHeader';
import { Banner } from './Banner';

export interface PageProps {
  className?: string;
  asideSlot?: ReactNode;
}

const PageStyles = tv({
  slots: {
    block: ['flex flex-col flex-grow content-start p-0 mx-auto w-full'],
  },
});

export const Page = ({
  className,
  children,
  ...props
}: PropsWithChildren<PageProps>) => {
  const styles = PageStyles();

  return (
    <article
      {...props}
      className={classnames('page', className, styles.block())}
    >
      {children}
    </article>
  );
};

Page.Header = PageHeader;
Page.Banner = Banner;
Page.Block = PageBlock;

const PageBlockStyles = tv({
  base: ['flex flex-grow content-start my-4 mx-auto w-full px-4'],
  defaultVariants: {
    direction: 'column',
  },
  variants: {
    direction: {
      column: 'flex flex-col',
      row: 'flex flex-row',
    },
  },
});

function PageBlock(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>> &
    VariantProps<typeof PageBlockStyles>
) {
  const styles = PageBlockStyles();
  return (
    <div
      className={classnames('page-block', props.className, styles)}
      {...props}
    />
  );
}
