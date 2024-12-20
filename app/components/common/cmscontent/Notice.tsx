import React, { type PropsWithChildren, type ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Icon, IconProps } from '~/components/ds/icon/Icon';

const Styles = tv({
  slots: {
    icon: 'w-6 h-6 pt-0',
    block: [
      'flex flex-row',
      'rounded border-l-0',
      'gap-2 bg-background-card text-informative',
      'items-center px-4 py-2 my-4',
      '[& p]:p-0 [& p]:m-0',
    ],
    content: ['flex flex-row flex-wrap', '[&_p]:last:m-0'],
  },
  defaultVariants: { type: 'info' },
  variants: {
    type: {
      info: {
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

const iconMap: {
  [key in keyof typeof Styles.variants.type]: IconProps['name'];
} = {
  info: 'InfoIcon',
  cautious: 'MessageCircleWarning',
  positive: 'CheckCircle',
  critical: 'CloudLightningIcon',
};

export function Notice({
  children,
  className,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  > &
    VariantProps<typeof Styles> &
    (
      | { icon: ReactNode }
      | { type: 'info' | 'cautious' | 'positive' | 'critical'; size: number }
    )
>) {
  const styles = Styles(props);

  const iconName: IconProps['name'] =
    'type' in props && props.type ? iconMap[props.type] : iconMap.info;

  return (
    <div className={classnames(className, styles.block())}>
      <Icon
        name={iconName}
        className={classnames(styles.icon())}
      />
      <div className={classnames(styles.content())}>{children}</div>
    </div>
  );
}
