import { createVar, style } from '@vanilla-extract/css';

export const BannerImageUrlVar = createVar();
export const BannerCreditVar = createVar();

export const block = style({
  backgroundImage: BannerImageUrlVar,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  minHeight: '200px',
  maxHeight: '200px',
  width: '100%',

  position: 'relative',
});

export const credit = style({
  fontSize: 10,
  opacity: 0.3,
  textAlign: 'right',
  padding: 8,
  position: 'absolute',
  bottom: 0,
  right: 0,
  selectors: {
    '&:after': {
      display: 'block',
      content: BannerCreditVar,
    },
  },
});
