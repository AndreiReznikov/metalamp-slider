const path = require('path');

module.exports = {
  env: {
    browser: true,
    node: true,
    jquery: true,
    'jest/globals': true,
  },
  globals: {
    NodeJS: true,
    JQuery: true,
    $: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript/base',
    'plugin:fsd/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver':
    {
      alias: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          map: [
              ['~', path.join(__dirname, 'src')]
          ]
      },
    },
  },
  plugins: [
    'fsd',
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'linebreak-style': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
      },
    ],
  },
};
