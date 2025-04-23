import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: eslintPluginPrettier,
    },

    rules: {
      'prettier/prettier': ['error', { endOfLine: 'lf' }],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next'],
            ['^@?\\w', '^\\w'],
            ['^@components'],
            ['^@templates', '^@organisms', '^@molecules', '^@atoms'],
            ['^@stores', '^@hooks', '^@utils'],
            ['^@config', '^@const', '^@customTypes'],
            ['^@styles', '^@public', '^@types'],
            ['^[./]'],
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
