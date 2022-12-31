module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
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
  plugins: [
    'fsd',
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'linebreak-style': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
