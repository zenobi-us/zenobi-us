export const TypefaceNames = {
  serif: '"Roboto Slab Variable"',
  sans: '"Open Sans"',
  mono: '"Roboto Mono Variable"',
};

import { kebabCase } from 'lodash-es';
import { flatten } from 'flat';

export const Typeface: Record<string, string> = flatten(
  {
    Base: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '18px',
    },
    Splash: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: '36px',
    },
    PageHeading: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '22px',
    },
    PageMeta: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '16px',
    },
    SectionHeading: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '18px',
    },
    SectionDescription: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '18px',
    },
    Button: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontStyle: 'normal',
      fontSize: '16px',
    },
    Paragraph: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontSize: '16px',
      fontStyle: 'normal',
    },
    Mono: {
      fontFamily: TypefaceNames.mono,
      fontWeight: '400',
      fontSize: '14px',
      fontStyle: 'normal',
    },
    InputHelp: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontSize: '14px',
      fontStyle: 'normal',
    },
    InputLabel: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontSize: '14px',
      fontStyle: 'normal',
    },
    InputValue: {
      fontFamily: TypefaceNames.sans,
      fontWeight: '400',
      fontSize: '16px',
      fontStyle: 'normal',
    },
    InputPlaceholder: {
      fontFamily: TypefaceNames.sans,
      fontWeight: '400',
      fontSize: '16px',
      fontStyle: 'normal',
    },
    InputMessage: {
      fontFamily: TypefaceNames.serif,
      fontWeight: '400',
      fontSize: '14px',
      fontStyle: 'normal',
    },
  },
  {
    delimiter: '-',
    transformKey: kebabCase,
  }
);
