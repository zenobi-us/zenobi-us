import type { HtmlHTMLAttributes, ReactNode } from 'react';
import { Link } from '@remix-run/react';
import classNames from 'classnames';

export function Tag({
  label,
  icon,
  href,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement> & {
  href: string;
  icon?: ReactNode;
  label: ReactNode;
}) {
  return (
    <div
      data-testid="tag"
      className={classNames(
        'text-text-muted text-base bg-background-shadow',
        'px-2 py-1 rounded flex flex-wrap items-center gap-2',
        'hover:bg-background-overlay hover:text-text-hover'
      )}
      {...props}
    >
      {icon}
      <Link to={href}>{label}</Link>
    </div>
  );
}
