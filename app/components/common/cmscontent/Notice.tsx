import React, { useMemo, type PropsWithChildren, type ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import {
  CheckCircle,
  CloudLightningIcon,
  InfoIcon,
  MessageCircleWarning,
} from 'lucide-react';

import { classnames } from '~/core/classnames';

const Styles = tv({
  slots: {
    block: [
      'flex flex-row',
      'p-2 rounded border-l-0',
      'gap-2 bg-background-card text-informative',
      'items-center px-4 py-2 my-4',
      '[& p]:p-0 [& p]:m-0',
    ],
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

const iconMap = {
  info: InfoIcon,
  cautious: MessageCircleWarning,
  positive: CheckCircle,
  critical: CloudLightningIcon,
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
  const icon = useMemo(() => {
    if ('icon' in props) {
      return props.icon;
    }
    const Icon = iconMap[props.type || 'info'];

    if (!Icon) {
      return '';
    }

    return (
      <Icon
        width={props.size || 48}
        height={props.size || 48}
        className="self-start mx-1"
      />
    );
  }, [props]);

  return (
    <div className={classnames(className, styles.block())}>
      {icon}
      <div className={classnames(styles.content())}>{children}</div>
    </div>
  );
}
