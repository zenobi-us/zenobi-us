import { kebabCase } from 'lodash-es';
import { flatten } from 'flat';
import chroma from 'chroma-js';

import * as Palette from './palette';

export const RosePineDawn: Record<string, string> = flatten(
  {
    text: {
      base: Palette.rosePineDawn.text,
      muted: Palette.rosePineDawn.muted,
      disabled: chroma(Palette.rosePineDawn.iris).desaturate(1).hex(),
      highlighted: Palette.rosePineDawn.highlightLow,
      visited: chroma(Palette.rosePineDawn.iris).darken(0.2).hex(),
      hover: chroma(Palette.rosePineDawn.iris).brighten(0.2).hex(),
      strong: Palette.rosePineDawn.iris,
      quote: Palette.rosePineDawn.foam,

      positive: Palette.rosePineDawn.foam,
      cautious: Palette.rosePineDawn.gold,
      critical: Palette.rosePineDawn.rose,
      informative: Palette.rosePineDawn.iris,

      link: Palette.rosePineDawn.iris,
      linkActive: chroma(Palette.rosePineDawn.iris).hex(),
      linkHover: chroma(Palette.rosePineDawn.iris).brighten(0.2).hex(),
      linkVisited: chroma(Palette.rosePineDawn.iris).darken(0.2).hex(),

      button: Palette.rosePineDawn.base,
      buttonHover: chroma(Palette.rosePineDawn.base).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineDawn.base).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineDawn.base).desaturate(1).hex(),
      buttonSecondary: chroma(Palette.rosePineDawn.base).brighten(0.2),
      buttonSecondaryActive: chroma(Palette.rosePineDawn.iris)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: Palette.rosePineDawn.iris,
      buttonSecondaryHover: chroma(Palette.rosePineDawn.iris)
        .brighten(0.2)
        .hex(),

      inputFocused: Palette.rosePineDawn.iris,
      inputDisabled: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      inputInvalid: Palette.rosePineDawn.iris,
      inputLabel: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      inputValue: Palette.rosePineDawn.iris,
      inputPlaceholder: Palette.rosePineDawn.muted,
      inputHelp: Palette.rosePineDawn.iris,
    },
    headings: {
      primary: Palette.rosePineDawn.text,
      secondary: Palette.rosePineDawn.text,
      tertiary: Palette.rosePineDawn.text,
      subtitle: Palette.rosePineDawn.text,
    },
    background: {
      shadow: chroma(Palette.rosePineDawn.base).darken(0.1).hex(),
      base: Palette.rosePineDawn.base,
      elevated: Palette.rosePineDawn.foam,
      card: Palette.rosePineDawn.highlightLow,
      overlay: Palette.rosePineDawn.overlay,
      modal: Palette.rosePineDawn.overlay,

      positive: chroma(Palette.rosePineDawn.foam)
        .mix(Palette.rosePineDawn.base, 0.96)
        .desaturate(0.4)
        .hex(),
      cautious: Palette.rosePineDawn.iris,
      critical: chroma(Palette.rosePineDawn.love)
        .mix(Palette.rosePineDawn.base, 0.96)
        .hex(),
      informative: chroma(Palette.rosePineDawn.iris).darken(0.7).hex(),

      link: 'transparent',
      linkHover: chroma(Palette.rosePineDawn.iris)
        .mix(Palette.rosePineDawn.base, 0.9)
        .hex(),
      linkActive: chroma(Palette.rosePineDawn.iris)
        .mix(Palette.rosePineDawn.base, 0.95)
        .hex(),

      input: Palette.rosePineDawn.base,
      inputFocused: Palette.rosePineDawn.foam,
      inputHovered: Palette.rosePineDawn.foam,
      inputDisabled: Palette.rosePineDawn.base,
      inputInvalid: Palette.rosePineDawn.iris,

      button: Palette.rosePineDawn.foam,
      buttonHover: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineDawn.foam).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineDawn.foam).desaturate(1).hex(),
      buttonSecondary: Palette.rosePineDawn.overlay,
      buttonSecondaryHover: chroma(Palette.rosePineDawn.overlay)
        .brighten(0.2)
        .hex(),
      buttonSecondaryActive: chroma(Palette.rosePineDawn.overlay)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: chroma(Palette.rosePineDawn.overlay)
        .desaturate(1)
        .hex(),
    },
    border: {
      positive: Palette.rosePineDawn.foam,
      'positive-dim': chroma(Palette.rosePineDawn.foam).desaturate(0.4).hex(),
      cautious: Palette.rosePineDawn.gold,
      'cautious-dim': chroma(Palette.rosePineDawn.gold).desaturate(0.4).hex(),
      critical: Palette.rosePineDawn.rose,
      'critical-dim': chroma(Palette.rosePineDawn.rose).desaturate(0.4).hex(),
      informative: Palette.rosePineDawn.iris,
      'informative-dim': chroma(Palette.rosePineDawn.iris)
        .desaturate(0.4)
        .hex(),

      muted: Palette.rosePineDawn.muted,
      highlight: Palette.rosePineDawn.highlightLow,
      focused: Palette.rosePineDawn.iris,

      input: Palette.rosePineDawn.foam,
      inputFocused: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      inputHovered: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      inputDisabled: chroma(Palette.rosePineDawn.foam).brighten(0.2).hex(),
      inputValid: chroma(Palette.rosePineDawn.foam).brighten(0.5).hex(),
      inputInvalid: Palette.rosePineDawn.iris,

      button: Palette.rosePineDawn.iris,
      buttonHover: chroma(Palette.rosePineDawn.iris).brighten(0.2).hex(),
      buttonActive: chroma(Palette.rosePineDawn.iris).brighten(0.4).hex(),
      buttonDisabled: chroma(Palette.rosePineDawn.iris).desaturate(1).hex(),
      buttonSecondary: 'transparent',
      buttonSecondaryHover: chroma(Palette.rosePineDawn.iris)
        .brighten(0.2)
        .hex(),
      buttonSecondaryActive: chroma(Palette.rosePineDawn.iris)
        .brighten(0.4)
        .hex(),
      buttonSecondaryDisabled: Palette.rosePineDawn.iris,
    },
  },
  {
    transformKey: kebabCase,
    delimiter: '-',
  }
);
