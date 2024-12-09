import classNames from 'classnames';
import sugar from 'sugar';
import type { PropsWithChildren } from 'react';
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
    content: ['font-page-heading', 'inline-flex', 'items-start', 'gap-2'],
    label: [
      'font-paragraph',
      'bg-background-overlay',
      'text-text-disabled',
      'text-xs',
      'p-1',
      'rounded-sm',
    ],
    display: ['w-full', 'm-0', 'p-0'],
  },
  variants: {
    draft: {
      true: {
        post: ['opacity-50'],
      },
    },
  },
});

// export const date = style({
//   textAlign: 'right',
//   fontFamily: Tokens.typeface.PageHeading.fontFamily,
//   color: Tokens.palette.text.disabled,
//   fontSize: 16,
// });
// export const content = style({
//   fontFamily: Tokens.typeface.PageHeading.fontFamily,
//   alignItems: 'start',
// });

// export const label = style({
//   fontFamily: Tokens.typeface.Paragraph.fontFamily,
//   background: Tokens.palette.background.overlay,
//   color: Tokens.palette.text.disabled,
//   fontSize: 12,
//   boxSizing: 'border-box',
//   padding: 2,
//   paddingLeft: 4,
//   paddingRight: 4,
//   borderRadius: 4,
// });

// export const display = style({
//   width: '100%',
//   margin: 0,
//   padding: 0,
// });

// globalStyle(`${post} ${display} > *`, {
//   margin: 0,
//   padding: 0,
// });

export function TimelineItem({
  children,
  date,
  tags,
}: PropsWithChildren<{
  date: Date;
  tags: string[];
}>) {
  const styles = Styles({
    draft: tags.includes('draft'),
  });

  return (
    <li className={classNames(styles.post())}>
      {date && (
        <span className={styles.date()}>
          {sugar.Date.format(sugar.Date.create(date), '%h %d')}
        </span>
      )}
      <div className={styles.content()}>
        {tags &&
          tags.map((tag) => (
            <span
              key={tag}
              className={styles.label()}
            >
              {tag}
            </span>
          ))}
        <div className={styles.display()}>{children}</div>
      </div>
    </li>
  );
}
