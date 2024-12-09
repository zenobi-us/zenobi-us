import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

const Styles = tv({
  base: '',
  variants: {
    edge: {
      bottom: ['bottom-0'],
      right: ['right-0'],
      left: ['left-0'],
      top: ['top-0'],
    },
    floating: {
      true: ['fixed bottom-0', 'z-10 fixed'],
    },
  },
  defaultVariants: {
    edge: 'bottom',
    floating: false,
  },
});

export function Sticky({
  children,
  edge,
}: Omit<VariantProps<typeof Styles>, 'floating'> & {
  children: ({ floating }: { floating: boolean }) => React.ReactNode;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef);
  const floating = !isInView;
  const styles = Styles({ floating, edge });

  return (
    <div>
      <div ref={elementRef}>
        <div className={classnames(styles)}>
          {children({
            floating,
          })}
        </div>
      </div>
    </div>
  );
}
