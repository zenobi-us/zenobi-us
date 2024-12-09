import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';

import { classnames } from '~/core/classnames';

export type BlockProps = {
  className?: string;
  debug?: boolean;
  as?: React.ElementType;
  footerSlot?: ReactNode;
};

export const Block = ({
  className,
  footerSlot,
  children,
  as,
  debug = false,
}: PropsWithChildren<BlockProps>) => {
  const Component = as || 'div';

  return (
    <Component
      className={classnames(
        'block',
        debug && 'block--debug',
        'max-w-[800px]',
        className
      )}
    >
      <div className="block__container">
        <div className="block__content">{children}</div>
        {footerSlot && <div className="block__footer">{footerSlot}</div>}
      </div>
    </Component>
  );
};
