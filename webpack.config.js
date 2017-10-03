const path = require('path');
const webpack = require('webpack');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const packageJson = require('./package.json');

/* Environment */
const environment = process.env.NODE_ENV;
const PRODUCTION = (environment === 'production');

module.exports = {
  entry: path.resolve(__dirname, packageJson.source),
  output: {
    path: __dirname,
    filename: packageJson.main,
    library: packageJson.libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),
    PRODUCTION && new BabelMinifyPlugin({
      removeConsole: true,
      mangle: {
        topLevel: true
      }
    })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: PRODUCTION
            }
          }
        ]
      }
    ]
  }
};
