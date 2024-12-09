import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { tv } from 'tailwind-variants';
import type { HTMLAttributes } from 'react';

import { classnames } from '~/core/classnames';

const Styles = tv({
  slots: {
    block: 'text-page-heading no-underline justify-center items-center',
  },
});

// import { style } from '@vanilla-extract/css';

// import { Tokens } from '@zenobius/ui-web-uikit/tokens';

// export const link = style({
//   fontFamily: Tokens.typeface.PageHeading.fontFamily,
//   textDecoration: 'none',
// });

// export const icon = style({
//   fontFamily: Tokens.typeface.PageHeading.fontFamily,
//   textDecoration: 'none',
//   fontWeight: 900,
//   marginTop: -5,
// });

// export const visuallyHidden = style({
//   position: 'absolute',
//   width: 1,
//   height: 1,
//   margin: -1,
//   padding: 0,
//   overflow: 'hidden',
//   clip: 'rect(0, 0, 0, 0)',
//   whiteSpace: 'nowrap',
//   border: 0,
// });

export function EmailLink({ className }: HTMLAttributes<HTMLAnchorElement>) {
  const styles = Styles();
  return (
    <a
      className={classnames(className, styles.block())}
      href="/contact"
      title="Send me a direct message"
      rel="noopener noreferrer"
      target="_blank"
    >
      <EnvelopeClosedIcon
        width={32}
        height={32}
      />
    </a>
  );
}
