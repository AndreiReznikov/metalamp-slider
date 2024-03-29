const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PugPlugin = require('pug-plugin');

const { NODE_ENV } = process.env;

const entryPoints = {
  demo: path.resolve(__dirname, 'src/demo/index.ts'),
  slider: path.resolve(__dirname, 'src/index.ts'),
};

module.exports = {
  mode: NODE_ENV || 'development',
  entry: entryPoints,
  output: {
    path: path.resolve(__dirname, 'pooshkaSliderDemo'),
    filename: "[name].min.js",
  },
  resolve: {
    extensions: ['.js', '.ts', '.pug', '.scss', '.json'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    }
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-preset-env',
                ],
              ],
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      },
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin({
      template: './src/demo/index.pug',
      filename: './index.html',
      chunks: '../index.js',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
  },
};
