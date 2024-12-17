import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { motion, type Transition } from 'framer-motion';
import { useLocation } from '@remix-run/react';

import { classnames } from '~/core/classnames';

import { PageHeader } from './PageHeader';
import { Banner } from './Banner';

export interface PageProps {
  className?: string;
  asideSlot?: ReactNode;
}

const PageAnimationVariants = {
  Fade: {
    start: { opacity: 0 },
    end: { opacity: 1 },
    exit: { opacity: 0 },
  },
  FadeSquash: {
    start: { x: '0', opacity: 0, webkitMaskSize: '0' },
    end: { x: '0', opacity: 1, width: '100%' },
    exit: { x: '0', opacity: 1, width: '0' },
  },
  FadeSlide: {
    start: { opacity: 0, y: -1000 },
    end: { opacity: 1, y: 0 },
    exit: { opacity: 1, y: 1000 },
  },
  FadeBump: {
    start: { opacity: 0, x: 30 },
    end: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
};

const PageTransitions: Transition = {
  delay: 0.25,
  easings: 'easeInOut',
};

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
    <motion.article
      data-testid="page"
      className={classnames('page', className, styles.block())}
      key={useLocation().key}
      variants={PageAnimationVariants.Fade}
      transition={PageTransitions}
      initial="start"
      animate="end"
      exit="exit"
      {...props}
    >
      {children}
    </motion.article>
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
      data-testid="page-block"
      className={classnames('page-block', props.className, styles)}
      {...props}
    />
  );
}
