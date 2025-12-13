import type { BundledLanguage, BundledTheme } from 'shiki';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';

export const SHIKI_THEMES = {
  dark: 'rose-pine',
  light: 'rose-pine-moon',
} as const satisfies Record<string, BundledTheme>;

export const SHIKI_TRANSFORMERS = [
  transformerNotationDiff(),
  transformerNotationHighlight({}),
  transformerNotationWordHighlight(),
  transformerNotationFocus(),
  transformerNotationErrorLevel(),
];

export const SHIKI_TOKENS_MAP = {
  fn: 'entity.name.function',
};

/**
 * Common languages to preload for runtime highlighting
 */
export const SHIKI_LANGUAGES: BundledLanguage[] = [
  'typescript',
  'javascript',
  'json',
  'bash',
  'shell',
  'markdown',
  'yaml',
  'toml',
  'python',
  'rust',
  'go',
  'sql',
  'dockerfile',
  'html',
  'css',
  'tsx',
  'jsx',
];

/**
 * Configuration for rehype-pretty-code (build-time)
 */
export const REHYPE_PRETTY_CODE_OPTIONS = {
  theme: SHIKI_THEMES,
  keepBackground: false,
  tokensMap: SHIKI_TOKENS_MAP,
  transformers: SHIKI_TRANSFORMERS,
};
