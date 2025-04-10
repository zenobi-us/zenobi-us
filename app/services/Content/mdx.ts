import type { Options } from '@content-collections/mdx';
import remarkGfm from 'remark-gfm';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { rehypePrettyCode } from 'rehype-pretty-code';
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import remarkSupersub from 'remark-supersub';
import remarkHeadingId from 'remark-heading-id';
import remarkSectionize from 'remark-sectionize';
import remarkEmoji from 'remark-emoji';
import remarkEmbedImages from 'remark-embed-images';
import { remarkNomnoml } from '@zenobius/remark-nomnoml';
import remarkRemoveComments from 'remark-remove-comments';
export const rehypeOptions: Options['rehypePlugins'] = [
  [
    rehypePrettyCode,
    {
      theme: {
        dark: 'github-dark-dimmed',
        light: 'github-light',
      },
      keepBackground: false,
      tokensMap: {
        fn: 'entity.name.function',
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight({}),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
      ],
    },
    rehypeMdxImportMedia,
  ],
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
