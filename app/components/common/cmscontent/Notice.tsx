import React, { type PropsWithChildren } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Icon } from '~/components/ds/icon/Icon';

const Styles = tv({
  slots: {
    block: [
      'flex flex-row',
      'p-2 rounded border-l-0',
      'gap-2 bg-background-card text-informative',
      'items-center px-4 py-2 my-4',
      '[& p]:p-0 [& p]:m-0',
    ],
    icon: 'w-6 h-6', //['hidden', 'hover:block'],
    content: 'flex flex-row pt-1',
  },
  variants: {
    tone: {
      informative: {
        block: 'bg-background-informative text-text-informative',
      },
      positive: {
        block: 'bg-background-positive text-text-positive',
      },
      critical: {
        block: 'bg-background-critical text-text-critical',
      },
      cautious: {
        block: 'bg-background-cautious text-text-cautious',
      },
    },
  },
});

export function Notice({
  children,
  className,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  > &
    VariantProps<typeof Styles>
>) {
  const styles = Styles(props);

  return (
    <div className={classnames(className, styles.block())}>
      <Icon
        name="InfoCircledIcon"
        size="small"
        className={styles.icon()}
      />
      <div className={classnames(styles.content())}>{children}</div>
    </div>
  );
}
