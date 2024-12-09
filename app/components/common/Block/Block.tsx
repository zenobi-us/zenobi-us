import type { HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const BlockStyles = tv({
  base: 'flex flex-row justify-start gap-2',
});

function Block({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = BlockStyles();
  return (
    <div
      className={classnames('block', className, styles)}
      {...props}
    >
      {children}
    </div>
  );
}

const BlockLeftStyles = tv({
  base: 'flex flex-row justify-start gap-2',
});

function BlockLeft({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = BlockLeftStyles();
  return (
    <div
      className={classnames('block-left', className, styles)}
      {...props}
    >
      {children}
    </div>
  );
}

const BlockMainStyles = tv({
  base: 'flex flex-row justify-start gap-2',
});

function BlockMain({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = BlockMainStyles();
  return (
    <div
      className={classnames('block', className, styles)}
      {...props}
    >
      {children}
    </div>
  );
}

const BlockRightStyles = tv({
  base: 'flex flex-row justify-start gap-2',
});

function BlockRight({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = BlockRightStyles();
  return (
    <div
      className={classnames('block', className, styles)}
      {...props}
    >
      {children}
    </div>
  );
}

const BlockHeaderStyles = tv({
  base: 'flex flex-start, md:flex-end',
});

function BlockHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = BlockHeaderStyles();
  return (
    <div
      className={classnames('block-header', className, styles)}
      {...props}
    >
      {children}
    </div>
  );
}

Block.Header = BlockHeader;
Block.Left = BlockLeft;
Block.Right = BlockRight;
Block.Main = BlockMain;

export { Block, BlockLeft, BlockRight, BlockMain, BlockHeader };
