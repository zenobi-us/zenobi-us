import type { ReactNode } from 'react';
import { Link } from '@remix-run/react';
import classNames from 'classnames';

export function Tag({
  label,
  icon,
  href,
}: {
  href: string;
  icon?: ReactNode;
  label: ReactNode;
}) {
  return (
    <div
      className={classNames(
        'text-text-muted text-base bg-background-shadow',
        'px-2 py-1 rounded flex flex-wrap items-center gap-2',
        'hover:bg-background-overlay hover:text-text-hover'
      )}
    >
      {icon}
      <Link to={href}>{label}</Link>
    </div>
  );
}
