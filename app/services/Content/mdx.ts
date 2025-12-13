import type { Options } from '@content-collections/mdx';
import remarkGfm from 'remark-gfm';
import { rehypePrettyCode } from 'rehype-pretty-code';
import remarkSupersub from 'remark-supersub';
import remarkHeadingId from 'remark-heading-id';
import remarkSectionize from 'remark-sectionize';
import remarkEmoji from 'remark-emoji';
import remarkEmbedImages from 'remark-embed-images';
import { remarkNomnoml } from '@zenobius/remark-nomnoml';
import remarkRemoveComments from 'remark-remove-comments';

import { REHYPE_PRETTY_CODE_OPTIONS } from './shikiOptions';

export const rehypeOptions: Options['rehypePlugins'] = [
  [rehypePrettyCode, REHYPE_PRETTY_CODE_OPTIONS],
];

export const remarkOptions: Options['remarkPlugins'] = [
  remarkRemoveComments,
  [
    // @ts-expect-error - types are wrong
    remarkNomnoml,
    {
      style: [
        '#stroke:hsl(var(--twc-text-link))',
        '#fill:hsl(var(--twc-background-card));hsl(var(--twc-background-overlay))',
      ].join('\n'),
    },
  ],
  remarkSupersub,
  remarkSectionize,
  [remarkHeadingId, { defaults: true }],
  remarkGfm,
  remarkEmoji,
  remarkEmbedImages,
];

export const mdxOptions = (options: Options = {}) => {
  options.rehypePlugins = [...(options.rehypePlugins || []), ...rehypeOptions];
  options.remarkPlugins = [...(options.remarkPlugins || []), ...remarkOptions];
  return options;
};
