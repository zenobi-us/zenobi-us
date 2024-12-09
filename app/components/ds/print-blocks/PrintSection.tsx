import classNames from 'classnames';

import * as Styles from './PrintSection.css';

export function PrintSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={classNames('print-section', Styles.block)}>
      <h2 className={classNames('print-section__title', Styles.title)}>
        {title}
      </h2>
      {children}
    </div>
  );
}
