import { type HTMLAttributes, type PropsWithChildren } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { BrowserCmsContent } from '../cmscontent/CmsContent';

const Styles = tv({
  slots: {
    block: [
      'flex flex-col justify-center items-center gap-2 my-0 mx-auto mt-16 pt-4 pb-4',
      'max-w-screen-md w-full',
      'lg:flex-row lg:justify-between lg:items-start md:w-full',
      '[kerning: revert-layer] text-text-link border-t-2 border-t-background-overlay min-h-[120px]',
    ],
    blurb: 'text-base text-center p-0',
    links: 'flex',
  },
});

type GlobalFooterStyleProps = VariantProps<typeof Styles>;
type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  isVisible?: boolean;
  className?: string;
  content?: string;
} & GlobalFooterStyleProps;

export function GlobalFooter({
  className,
  content,
  children,
  ...props
}: Props) {
  const styles = Styles(props);
  return (
    <footer className={classnames('global-footer', className, styles.block())}>
      {content && (
        <BrowserCmsContent
          className={styles.blurb()}
          content={content}
        />
      )}
      <div className={styles.links()}>{children}</div>
    </footer>
  );
}
