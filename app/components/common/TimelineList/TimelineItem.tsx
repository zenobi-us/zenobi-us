import classNames from 'classnames';
import sugar from 'sugar';
import {
  useCallback,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react';
import { tv } from 'tailwind-variants';

// export const post = style({
//   display: 'grid',
//   gridTemplateColumns: '64px auto',
//   marginBottom: Tokens.spacing.Normal,
//   lineHeight: 1.6,
//   gap: Tokens.spacing.Normal,
//   selectors: {
//     [`.is--draft&`]: {
//       opacity: 0.5,
//     },
//   },
// });

const Styles = tv({
  slots: {
    post: ['grid grid-cols-[64px,1fr] gap-4', 'mb-4', 'leading-6'],
    date: ['text-right', 'font-page-heading', 'text-disabled', 'text-16'],
    content: ['font-page-heading', 'inline whitespace-break-spaces'],
    label: [
      'font-paragraph',
      'bg-background-overlay',
      'text-text-disabled',
      'text-xs',
      'p-1 ml-2',
      'rounded-sm',
    ],
    display: ['inline', 'm-0', 'p-0'],
  },
  variants: {
    draft: {
      true: {
        post: ['opacity-50'],
      },
    },
  },
});

export function TimelineItem({
  children,
  date,
  dateRenderer,
  tags,
}: PropsWithChildren<{
  date: Date;
  dateRenderer?: ({ date }: { date: Date }) => JSX.Element;
  tags: string[];
}>) {
  const styles = Styles({
    draft: tags.includes('draft'),
  });

  const renderDate = useCallback(
    ({ date }: { date: Date }) => {
      if (dateRenderer) {
        return dateRenderer({ date });
      }

      return <TimelineItemDate date={date} />;
    },
    [dateRenderer]
  );

  return (
    <li className={classNames(styles.post())}>
      {date && renderDate({ date })}
      <div className={styles.content()}>
        <div className={styles.display()}>{children}</div>
        {tags &&
          tags.map((tag) => (
            <span
              key={tag}
              className={styles.label()}
            >
              {tag}
            </span>
          ))}
      </div>
    </li>
  );
}

export function TimelineItemDate({
  date,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { date: Date }) {
  const styles = Styles();
  return (
    <span
      className={styles.date({ className })}
      {...props}
    >
      {sugar.Date.format(sugar.Date.create(date), '%h %d')}
    </span>
  );
}
