import { kebabCase } from 'lodash-es';
import { flatten } from 'flat';
import chroma from 'chroma-js';

import * as Palette from './palette';

export const RosePineMoon: Record<string, string> = flatten(
  {
    text: {
      base: Palette.rosePineMoon.text,
      muted: Palette.rosePineMoon.muted,
      disabled: chroma(Palette.rosePineMoon.iris).desaturate(1).hex(),
      highlighted: Palette.rosePineMoon.highlightLow,
      visited: chroma(Palette.rosePineMoon.iris).darken(0.2).hex(),
      hover: chroma(Palette.rosePineMoon.iris).brighten(0.2).hex(),
      strong: Palette.rosePineMoon.iris,
      quote: Palette.rosePineMoon.foam,

      positive: Palette.rosePineMoon.foam,
      cautious: Palette.rosePineMoon.gold,
      critical: Palette.rosePineMoon.rose,
      informative: Palette.rosePineMoon.iris,

      link: Palette.rosePineMoon.iris,
      linkActive: chroma(Palette.rosePineMoon.iris).hex(),
      linkHover: chroma(Palette.rosePineMoon.iris).brighten(0.2).hex(),
      linkVisited: chroma(Palette.rosePineMoon.iris).darken(0.2).hex(),

      button: Palette.rosePineMoon.base,
      buttonHover: chroma(Palette.rosePineMoon.base).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineMoon.base).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineMoon.base).desaturate(1).hex(),
      buttonSecondary: Palette.rosePineMoon.iris,
      buttonSecondaryActive: chroma(Palette.rosePineMoon.iris)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: Palette.rosePineMoon.iris,
      buttonSecondaryHover: chroma(Palette.rosePineMoon.iris)
        .brighten(0.2)
        .hex(),

      inputFocused: Palette.rosePineMoon.iris,
      inputDisabled: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      inputInvalid: Palette.rosePineMoon.iris,
      inputLabel: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      inputValue: Palette.rosePineMoon.iris,
      inputPlaceholder: Palette.rosePineMoon.muted,
      inputHelp: Palette.rosePineMoon.iris,
    },
    headings: {
      primary: chroma(Palette.rosePineMoon.iris).brighten(0.2).hex(),
      secondary: chroma(Palette.rosePineMoon.iris).brighten(0.2).hex(),
      tertiary: Palette.rosePineMoon.iris,
      subtitle: Palette.rosePineMoon.text,
    },
    background: {
      shadow: chroma(Palette.rosePineMoon.base).darken(0.1).hex(),
      base: Palette.rosePineMoon.base,
      elevated: Palette.rosePineMoon.foam,
      card: Palette.rosePineMoon.highlightLow,
      overlay: Palette.rosePineMoon.overlay,
      modal: Palette.rosePineMoon.overlay,

      positive: chroma(Palette.rosePineMoon.foam)
        .mix(Palette.rosePineMoon.base, 0.98)
        .hex(),
      cautious: chroma(Palette.rosePineMoon.gold)
        .mix(Palette.rosePineMoon.base, 0.96)
        .hex(),
      critical: chroma(Palette.rosePineMoon.love)
        .mix(Palette.rosePineMoon.base, 0.96)
        .hex(),
      informative: chroma(Palette.rosePineMoon.iris)
        .mix(Palette.rosePineMoon.base, 0.96)
        .hex(),

      link: 'transparent',
      linkHover: chroma(Palette.rosePineMoon.iris)
        .mix(Palette.rosePineMoon.base, 0.9)
        .hex(),
      linkActive: chroma(Palette.rosePineMoon.iris)
        .mix(Palette.rosePineMoon.base, 0.95)
        .hex(),

      input: Palette.rosePineMoon.base,
      inputFocused: Palette.rosePineMoon.foam,
      inputHovered: Palette.rosePineMoon.foam,
      inputDisabled: Palette.rosePineMoon.base,
      inputInvalid: Palette.rosePineMoon.iris,

      button: Palette.rosePineMoon.foam,
      buttonHover: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineMoon.foam).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineMoon.foam).desaturate(1).hex(),
      buttonSecondary: Palette.rosePineMoon.overlay,
      buttonSecondaryHover: chroma(Palette.rosePineMoon.overlay)
        .brighten(0.2)
        .hex(),
      buttonSecondaryActive: chroma(Palette.rosePineMoon.overlay)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: chroma(Palette.rosePineMoon.overlay)
        .desaturate(1)
        .hex(),
    },
    border: {
      positive: Palette.rosePineMoon.foam,
      'positive-dim': chroma(Palette.rosePineMoon.foam)
        .mix(Palette.rosePineMoon.base, 0.95)
        .hex(),
      cautious: Palette.rosePineMoon.gold,
      'cautious-dim': chroma(Palette.rosePineMoon.gold)
        .mix(Palette.rosePineMoon.base, 0.95)
        .hex(),
      critical: Palette.rosePineMoon.rose,
      'critical-dim': chroma(Palette.rosePineMoon.rose)
        .mix(Palette.rosePineMoon.base, 0.95)
        .hex(),
      informative: Palette.rosePineMoon.iris,
      'informative-dim': chroma(Palette.rosePineMoon.iris)
        .mix(Palette.rosePineMoon.base, 0.95)
        .hex(),

      muted: Palette.rosePineMoon.muted,
      highlight: Palette.rosePineMoon.highlightLow,
      focused: Palette.rosePineMoon.iris,

      input: Palette.rosePineMoon.foam,
      inputFocused: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      inputHovered: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      inputDisabled: chroma(Palette.rosePineMoon.foam).brighten(0.2).hex(),
      inputValid: chroma(Palette.rosePineMoon.foam).brighten(0.5).hex(),
      inputInvalid: Palette.rosePineMoon.iris,

      button: Palette.rosePineMoon.iris,
      buttonHover: chroma(Palette.rosePineMoon.iris).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineMoon.iris).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineMoon.iris).desaturate(1).hex(),
      buttonSecondary: 'transparent',
      buttonSecondaryHover: chroma(Palette.rosePineMoon.iris)
        .brighten(0.2)
        .hex(),
      buttonSecondaryActive: chroma(Palette.rosePineMoon.iris)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: Palette.rosePineMoon.iris,
    },
  },
  {
    transformKey: kebabCase,
    delimiter: '-',
  }
);
