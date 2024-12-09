import type { PropsWithChildren } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const BreadcrumbsStyles = tv({
  base: '',
});

export function Breadrumbs({
  children,
  ...props
}: PropsWithChildren<VariantProps<typeof BreadcrumbsStyles>>) {
  const styles = BreadcrumbsStyles(props);
  return (
    <nav
      aria-label="Breadcrumb"
      className={styles}
    >
      <ol>{children}</ol>
    </nav>
  );
}

const BreadcrumbItemStyles = tv({
  base: 'text-sm text-gray-600',
  variants: {
    active: {
      true: 'text-gray-900',
    },
  },
});

export function BreadcrumbItem({
  children,
  ...props
}: PropsWithChildren<VariantProps<typeof BreadcrumbItemStyles>>) {
  const styles = BreadcrumbItemStyles(props);
  return <li className={styles}>{children}</li>;
}
