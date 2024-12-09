import { forwardRef } from 'react';

import type { BoxProps } from './Box';

export const ComponentWithRef = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    return (
      <div
        {...rest}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
ComponentWithRef.displayName = 'ComponentWithRef';
