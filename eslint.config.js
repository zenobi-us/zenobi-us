import globals from 'globals';
import pluginJs from '@eslint/js';
import { configs as tsConfig } from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginImport from 'eslint-plugin-import';
import pluginReactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['node_modules', 'dist', '.yarncache', '.cache'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  ...tsConfig.recommended,

  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // eslint flatconfig compat
  // https://stackoverflow.com/questions/76183413/integration-of-eslint-plugin-react-hooks-recommended-with-eslint-config-js
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    rules: {
      'no-nested-ternary': 'error',
      'import/no-default-export': 'error',
      curly: 'error',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: false,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
    },
  },
  {
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            ['parent', 'internal'],
            ['sibling'],
            'index',
            'object',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'parent',
              patternOptions: {
                matchBase: true,
              },
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: [],
        },
      ],
    },
  },
  {
    files: [
      '*.stories.ts',
      '*.stories.tsx',
      '*.stories.js',
      '*.stories.jsx',
      '.storybook/main.ts',
      '.storybook/preview.ts',
      'vite.config.ts',
      'remix.config.js',
      'content-collections.ts',
      'jest.config.ts',
      'postcss.config.js',
      'eslint.config.js',
      'tailwind.config.ts',
      'playwright.config.ts',
      'babel.config.js',
      '*.d.ts',
      '+*.h.ts',
      'app/**/*.tsx',
      'app/**/*.worker.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
];
