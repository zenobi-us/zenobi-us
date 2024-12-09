import React from 'react';
import { type ComponentProps } from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import nconf from 'nconf';

import { Logo } from './Logo';

function render(props: ComponentProps<typeof Logo>) {
  return renderToString(React.createElement(Logo, props));
}

function write(icon: string, path: string) {
  fs.writeFileSync(path, icon);
}

const config = nconf
  .argv({
    className: {
      type: 'string',
      default: '',
    },
    fgFill: {
      type: 'string',
      default: 'none',
    },
    bgFill: {
      type: 'string',
      default: 'none',
    },
    arrowStroke: {
      type: 'string',
      default: 'currentColor',
    },
    fgStroke: {
      type: 'string',
      default: 'currentColor',
    },
    bgStroke: {
      type: 'string',
      default: 'currentColor',
    },
    output: {
      type: 'string',
      default: 'favicon.svg',
    },
  })
  .get();

console.log(`Rendering favicon to ${config.output}`);
console.dir(config);

const icon = render({
  className: config.className,
  fgFill: config.fgFill,
  bgFill: config.bgFill,
  arrowStroke: config.arrowStroke,
  fgStroke: config.fgStroke,
  bgStroke: config.bgStroke,
});
write(icon, config.output);
