const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const packageJson = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));

/* Environment */
const environment = process.env.NODE_ENV;
const PRODUCTION = (environment === 'production');

function getBabelConfig() {
  if (PRODUCTION) {
    babelConfig.presets[0][1].modules = false;
  }

  return babelConfig;
}

module.exports = {
  mode: environment || 'development',
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
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: Object.assign({}, {
              cacheDirectory: true
            }, getBabelConfig())
          },
          {
            loader: 'awesome-typescript-loader'
          },
          {
            loader: 'tslint-loader',
            options: {
              emitErrors: PRODUCTION
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
