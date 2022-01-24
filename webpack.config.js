import { resolve as _resolve } from 'path';
import { ProvidePlugin } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const { NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

function setupDevtool() {
  if (IS_DEV) return 'eval';
  if (IS_PROD) return false;

  return false;
}

export const resolve = {
  extensions: ['.js', '.ts', '.json'],
};
export const mode = NODE_ENV || 'development';
export const entry = _resolve(__dirname, 'src/index.ts');
export const output = {
  path: _resolve(__dirname, 'dist'),
  filename: 'index.js',
};
export const module = {
  rules: [
    {
      test: /\.[tj]sx?$/,
      use: ['ts-loader'],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    },
  ],
};
export const plugins = [
  new HTMLWebpackPlugin({
    template: _resolve(__dirname, './src/index.html'),
  }),
  new ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
];
export const devServer = {
  port: 3000,
  open: true,
  hot: IS_DEV,
};
export const devtool = setupDevtool();
