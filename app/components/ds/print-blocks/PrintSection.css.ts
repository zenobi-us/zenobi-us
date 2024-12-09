import { globalStyle, style } from '@vanilla-extract/css';

// import { Tokens } from '@zenobius/ui-web-uikit/tokens'

export const block = style({
  '@media': {
    print: {
      breakInside: 'avoid',
    },
  },
});

globalStyle('.print-section', {
  '@media': {
    print: {
      breakInside: 'avoid',
    },
  },
});

export const title = style({});
